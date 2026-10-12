"""Encode browser-native intro variants from the supplied source, preserving its timing."""
from pathlib import Path
import hashlib
import json
import struct
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Supercar_in_underground_garage_1080p_20261012131710.mp4'
OUT = ROOT / 'public/media/intro'


def run(*args: str) -> str:
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


def atom_order(path: Path) -> list[str]:
    atoms = []
    with path.open('rb') as stream:
        while True:
            header = stream.read(8)
            if not header:
                break
            size, kind = struct.unpack('>I4s', header)
            header_size = 8
            if size == 1:
                size = struct.unpack('>Q', stream.read(8))[0]
                header_size = 16
            atoms.append(kind.decode('ascii'))
            if size == 0:
                break
            stream.seek(size - header_size, 1)
    return atoms


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    original_hash = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    results = []
    for name, width, height, crf in [('desktop', 1920, 1080, 23), ('mobile', 1280, 720, 24)]:
        destination = OUT / f'awakening-{name}-v1.mp4'
        run('ffmpeg', '-v', 'error', '-y', '-i', str(SOURCE), '-map', '0:v:0', '-an', '-vf', f'scale={width}:{height}:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level:v', '4.0', '-g', '48', '-movflags', '+faststart', str(destination))
        run('ffmpeg', '-v', 'error', '-i', str(destination), '-map', '0:v:0', '-f', 'null', '-')
        metadata = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,codec_type,width,height,pix_fmt,avg_frame_rate,nb_frames,duration,profile,level', '-show_entries', 'format=duration,size', '-of', 'json', str(destination)))
        atoms = atom_order(destination)
        assert atoms.index('moov') < atoms.index('mdat'), 'Metadata must precede media payload'
        results.append(dict(file=destination.name, crf=crf, bytes=destination.stat().st_size, metadata=metadata, atoms=atoms, fullDecode='pass'))
        poster = OUT / ('poster.webp' if name == 'desktop' else 'poster-mobile.webp')
        run('ffmpeg', '-v', 'error', '-y', '-i', str(SOURCE), '-frames:v', '1', '-vf', f'scale={width}:{height}:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', str(poster))
        print(destination.name, destination.stat().st_size, atoms, flush=True)
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == original_hash
    (OUT / 'asset-audit.json').write_text(json.dumps(dict(source=SOURCE.name, sourceSha256=original_hash, sourceUnchanged=True, variants=results), indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
