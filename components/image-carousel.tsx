"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-2xl">
        <img
          src={images[currentIndex]}
          alt={`${alt} - Imagem ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-6 right-6 bg-black/50 text-white px-6 py-3 rounded-full text-2xl font-medium backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-8 flex gap-4 justify-center overflow-x-auto pb-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? "ring-4 ring-primary scale-110" 
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${alt} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
