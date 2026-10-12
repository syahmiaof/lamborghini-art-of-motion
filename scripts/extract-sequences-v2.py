"""Reproducible extraction of the supplied 24fps cinematic sources; never edits MP4s."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCENES = [
    ('awakening', 'Supercar_in_underground_garage_1080p_20261012131710.mp4', 'ASSET-UNDERGROUND-REVEAL-001', 'User-supplied generated custom supercar concept: black and gold vehicle revealed by underground garage lighting'),
    ('presence', 'Supercar_filming_in_parking_garage_20261012133608.mp4', 'ASSET-PARKING-SWEEP-002', 'User-supplied generated custom supercar concept: exterior camera sweep revealing gold wheels and syahmiaof side livery'),
    ('cockpit', 'Supercar_interior_video_creation_1080p_20261012133612.mp4', 'ASSET-COCKPIT-003', 'User-supplied generated custom cockpit concept: camera moves toward the steering wheel, instrumentation and centre console'),
]


def run(*args: str) -> str:
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


def main() -> None:
    manifests = []
    for name, filename, asset_id, alt in SCENES:
        source = ROOT / filename
        sha = hashlib.sha256(source.read_bytes()).hexdigest()
        metadata = json.loads(run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,nb_frames,avg_frame_rate,codec_name,duration', '-of', 'json', str(source)))['streams'][0]
        if metadata['avg_frame_rate'] != '24/1' or int(metadata['nb_frames']) != 240:
            raise ValueError(f'{filename}: sampling expects the audited 240-frame 24fps source')
        run('ffmpeg', '-v', 'error', '-i', str(source), '-map', '0:v:0', '-f', 'null', '-')
        sequence_id = f'{name}-v2'
        directory = ROOT / 'public/media/sequences' / sequence_id
        directory.mkdir(parents=True, exist_ok=True)
        manifest = dict(id=sequence_id, assetRegisterId=asset_id, rightsStatus='approved', derivativeFramesAllowed=True, poster=f'/media/sequences/{sequence_id}/poster.webp', alt=alt)
        for variant, width, height, quality in [('desktop', 1440, 810, 77), ('mobile', 768, 432, 75)]:
            target = directory / variant
            target.mkdir(exist_ok=True)
            # Every other source frame plus the actual final source frame, not an fps-filter approximation.
            filters = rf'select=not(mod(n\,2))+eq(n\,239),scale={width}:{height}:flags=lanczos'
            run('ffmpeg', '-v', 'error', '-y', '-i', str(source), '-an', '-vf', filters, '-fps_mode', 'vfr', '-c:v', 'libwebp', '-quality', str(quality), '-compression_level', '5', '-start_number', '1', str(target / 'frame_%04d.webp'))
            frames = sorted(target.glob('frame_*.webp'))
            expected = [f'frame_{i:04d}.webp' for i in range(1, 122)]
            if [p.name for p in frames] != expected:
                raise ValueError(f'{sequence_id}/{variant}: unexpected frame list')
            for path in frames:
                with Image.open(path) as image:
                    if image.size != (width, height):
                        raise ValueError(f'Unexpected dimensions: {path}')
                    image.verify()
            manifest[variant] = dict(frameCount=121, width=width, height=height, extension='webp', urlTemplate=f'/media/sequences/{sequence_id}/{variant}/frame_{{frame}}.webp', totalBytes=sum(p.stat().st_size for p in frames), startIndex=1, padLength=4)
        shutil.copyfile(directory / 'desktop/frame_0001.webp', directory / 'poster.webp')
        (directory / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
        evidence = dict(source=filename, sha256=sha, video=metadata, selectedSourceFrameIndices=list(range(0, 240, 2)) + [239], extraction='12fps sampling plus final endpoint; unaltered first and final video frames', sourceIntegrity='ffmpeg full video decode exit 0')
        (directory / 'source-audit.json').write_text(json.dumps(evidence, indent=2) + '\n', encoding='utf-8')
        if hashlib.sha256(source.read_bytes()).hexdigest() != sha:
            raise ValueError(f'Source changed during extraction: {filename}')
        manifests.append((name, manifest))
        print(sequence_id, manifest['desktop']['totalBytes'], manifest['mobile']['totalBytes'], flush=True)
    source = "import type { SequenceManifest } from '../features/sequence/types'\n\n"
    for name, manifest in manifests:
        source += f'export const {name}Manifest: SequenceManifest = ' + json.dumps(manifest, indent=2) + '\n\n'
    (ROOT / 'src/data/sequences.ts').write_text(source, encoding='utf-8')


if __name__ == '__main__':
    main()
