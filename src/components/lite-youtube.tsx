"use client";

import { useState } from "react";

/**
 * Facade do YouTube — Core Web Vitals (LCP/TBT).
 * ────────────────────────────────────────────────────────────
 * Em vez de carregar o iframe do YouTube (~1 MB de JS) para cada vídeo,
 * renderiza apenas a miniatura oficial (img leve) e um botão de play.
 * O iframe só é criado quando o visitante clica — a página Yellow Week
 * passa a carregar instantaneamente, mesmo com 6 vídeos.
 *
 * Visual preservado: mesmo aspect-ratio 16:9 do .video do design system.
 */
export default function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <button
      type="button"
      className="video-facade"
      onClick={() => setActive(true)}
      aria-label={`Reproduzir vídeo: ${title}`}
    >
      {/* Miniatura oficial do YouTube — leve e idêntica ao player carregado */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
      />
      <span className="video-play" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}
