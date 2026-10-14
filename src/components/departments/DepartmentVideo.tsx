'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import type { DepartmentVideo as Video } from '@/sanity/departments'

/**
 * The department video, behind a poster and one play button.
 *
 * Nothing heavy loads until the reader asks for it: an uploaded file starts
 * on the click, and a YouTube or Vimeo player is only created then (the
 * "facade" pattern), so the page does not pay for an iframe nobody plays.
 *
 * With no video in the Studio yet, the frame stays in place with a short
 * note, so the department knows where it will go.
 */
export function DepartmentVideo({
  video,
  poster,
  name,
}: {
  video?: Video
  poster: { src: string; alt: string }
  name: string
}) {
  const [playing, setPlaying] = useState(false)

  if (playing && video?.kind === 'file') {
    return (
      <div className="dv">
        <video controls autoPlay playsInline className="dv-media">
          <source src={video.src} type={video.type} />
        </video>
      </div>
    )
  }

  if (playing && video?.kind === 'embed') {
    const src = `${video.src}${video.src.includes('?') ? '&' : '?'}autoplay=1`
    return (
      <div className="dv">
        <iframe
          src={src}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="dv-media"
        />
      </div>
    )
  }

  const playable = video?.kind === 'file' || video?.kind === 'embed'

  return (
    <div className={playable ? 'dv dv--poster' : 'dv dv--poster dv--empty'}>
      <Image
        src={poster.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="dv-poster"
      />
      <div className="dv-shade" aria-hidden="true" />

      {playable ? (
        <button
          type="button"
          className="dv-play"
          onClick={() => setPlaying(true)}
          aria-label={`Play the ${name} video`}
        >
          <span className="dv-play-ring" aria-hidden="true" />
          <Play className="dv-play-icon" aria-hidden="true" />
        </button>
      ) : video?.kind === 'link' ? (
        <a
          href={video.href}
          target="_blank"
          rel="noreferrer noopener"
          className="dv-play"
          aria-label={`Watch the ${name} video (opens in a new tab)`}
        >
          <span className="dv-play-ring" aria-hidden="true" />
          <ArrowUpRight className="dv-play-icon" aria-hidden="true" />
        </a>
      ) : (
        <div className="dv-soon">
          <span className="dv-play dv-play--idle" aria-hidden="true">
            <Play className="dv-play-icon" />
          </span>
          <p>Video coming soon</p>
        </div>
      )}
    </div>
  )
}
