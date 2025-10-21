"use client"

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ImageItem {
  id: string
  url: string
  title?: string
  description?: string
}

interface ImageCarouselProps {
  images: ImageItem[]
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

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

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
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title || `${alt} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title || `${alt} - Expanded view`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg mb-4"
              onClick={(e) => e.stopPropagation()}
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl text-center">
                {selectedImage.title && (
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="text-lg text-white/80 leading-relaxed">
                    {selectedImage.description}
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
