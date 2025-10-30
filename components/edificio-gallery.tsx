"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface GalleryItem {
  src: string
  title?: string | null
  description?: string | null
}

interface EdificioGalleryProps {
  items: GalleryItem[]
  labels: {
    gallery?: string
    photo?: string
    descriptionUnavailable?: string
  }
}

export default function EdificioGallery({ items, labels }: EdificioGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const count = items.length
  const safeIndex = (i: number) => (i + count) % count

  const prev = useCallback(() => setIndex((i) => safeIndex(i - 1)), [count])
  const next = useCallback(() => setIndex((i) => safeIndex(i + 1)), [count])

  const current = useMemo(() => items[index], [items, index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightboxOpen) return
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
      else if (e.key === "Escape") setLightboxOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen, prev, next])

  if (!items || items.length === 0) return null

  return (
    <div className="w-full">
      {/* Carousel */}
      <div className="relative rounded-xl overflow-hidden border border-border">
        <div className="aspect-[4/3] bg-muted">
          <img
            src={current.src}
            alt={current.title || labels.photo || "Foto"}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          />
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background border border-border shadow"
          onClick={prev}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background border border-border shadow"
          onClick={next}
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {items.map((it, i) => (
            <button
              key={i}
              className={`relative w-28 h-20 rounded-lg overflow-hidden border ${i === index ? "border-primary" : "border-border"}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <img src={it.src} alt={it.title || `${labels.photo || "Foto"} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="text-white text-lg truncate pr-4">
              {current.title || labels.photo || "Foto"}
            </div>
            <button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative flex-1 flex items-center justify-center">
            <button
              aria-label="Previous"
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={prev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img src={current.src} alt={current.title || labels.photo || "Foto"} className="max-h-[80vh] max-w-[90vw] object-contain" />
            <button
              aria-label="Next"
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={next}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          <div className="p-4 text-white/90 text-base max-w-5xl w-full mx-auto">
            {current.description || labels.descriptionUnavailable || "Descrição não disponível"}
          </div>
        </div>
      )}
    </div>
  )
}
