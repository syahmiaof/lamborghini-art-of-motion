import { useState } from 'react'
import type { MediaAsset } from '../data/media'

export function MediaFrame({ asset, className = '', priority = false, caption }: {
  asset: MediaAsset; className?: string; priority?: boolean; caption?: string
}) {
  const [failed, setFailed] = useState(false)
  return <figure className={'media-frame ' + className}>
    {!failed ? <img src={asset.src} srcSet={asset.srcSmall ? asset.srcSmall + ' 800w, ' + asset.src + ' ' + asset.width + 'w' : undefined}
      sizes="(max-width: 700px) 100vw, 90vw" width={asset.width} height={asset.height}
      alt={asset.alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
      fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />
      : <div className="media-failure" role="status"><span>Photography unavailable</span><p>{asset.alt}</p></div>}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
}
