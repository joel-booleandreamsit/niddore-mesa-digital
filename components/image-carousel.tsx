"use client"

import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useEffect } from 'react'

interface ImageCarouselProps {
  images: string[]
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

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add any additional setup here
    }
  }, [emblaApi])

  if (!images || images.length === 0) return null

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      {/* Embla Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-1/5 px-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm">
                <img
                  src={image}
                  alt={`${alt} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
