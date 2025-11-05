"use client"

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type MediaType = 'image' | 'video'

interface MediaItem {
  id: string
  url: string
  title?: string
  description?: string
  type?: MediaType // defaults to 'image' for backward compatibility
  posterUrl?: string // optional poster for videos
}

interface ImageCarouselProps {
  images: MediaItem[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      slidesToScroll: 1,
      containScroll: 'trimSnaps'
    },
    [AutoScroll({ speed: 1, stopOnInteraction: false })]
  )

  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add any additional setup here
    }
  }, [emblaApi])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className={`relative group overflow-hidden ${className}`}>
        {/* Embla Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={image.id || index} className="flex-shrink-0 w-1/5 px-2">
                <div 
                  className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setSelectedItem(image)}
                >
                  {((image.type || 'image') === 'video' || /\.(mp4|webm|ogg)(\?|$)/i.test(image.url)) ? (
                    <video
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                      poster={image.posterUrl}
                      aria-label={image.title || `${alt} - Vídeo ${index + 1}`}
                    >
                      <source src={image.url} />
                    </video>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.title || `${alt} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-full max-h-full flex flex-col items-center">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-16 -right-16 z-10 w-32 h-32 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <X className="w-10 h-10 text-white" />
            </button>
            {((selectedItem.type || 'image') === 'video' || /\.(mp4|webm|ogg)(\?|$)/i.test(selectedItem.url)) ? (
              <div className="max-w-[60vw] max-h-auto flex items-center justify-center">
                <video
                  className="w-full h-full object-contain rounded-lg mb-6"
                  controls
                  autoPlay
                  playsInline
                  muted
                  poster={selectedItem.posterUrl}
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={selectedItem.url} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="max-w-[60vw] max-h-auto flex items-center justify-center">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title || `${alt} - Expanded view`}
                  className="w-full h-full object-contain rounded-lg mb-6"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {(selectedItem.title || selectedItem.description) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 md:p-10 max-w-3xl text-center">
                {selectedItem.title && (
                  <h3 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                    {selectedItem.title}
                  </h3>
                )}
                {selectedItem.description && (
                  <p className="text-2xl md:text-3xl text-white/85 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
