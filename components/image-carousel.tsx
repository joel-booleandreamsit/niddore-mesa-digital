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
  const imagesPerView = 4 // Display 4 images at once

  const nextImages = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, images.length - imagesPerView + 1))
  }

  const prevImages = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, images.length - imagesPerView + 1)) % Math.max(1, images.length - imagesPerView + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  const visibleImages = images.slice(currentIndex, currentIndex + imagesPerView)
  const canGoNext = images.length > imagesPerView && currentIndex < images.length - imagesPerView
  const canGoPrev = images.length > imagesPerView && currentIndex > 0

  return (
    <div className={`relative group ${className}`}>
      {/* Main Images Display - 4 images side by side */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-8">
          {visibleImages.map((image, index) => (
            <div key={currentIndex + index} className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <img
                src={image}
                alt={`${alt} - Imagem ${currentIndex + index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {images.length > imagesPerView && (
          <>
            <button
              onClick={prevImages}
              disabled={!canGoPrev}
              className={`absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                !canGoPrev ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Imagens anteriores"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImages}
              disabled={!canGoNext}
              className={`absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                !canGoNext ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Próximas imagens"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > imagesPerView && (
          <div className="absolute top-6 right-6 bg-black/50 text-white px-6 py-3 rounded-full text-2xl font-medium backdrop-blur-sm">
            {currentIndex + 1}-{Math.min(currentIndex + imagesPerView, images.length)} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > imagesPerView && (
        <div className="mt-8 flex gap-4 justify-center overflow-x-auto pb-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index >= currentIndex && index < currentIndex + imagesPerView
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
