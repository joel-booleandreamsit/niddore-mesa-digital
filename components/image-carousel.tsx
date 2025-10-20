"use client"

import { useState, useEffect } from "react"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imagesPerView = 5 // Display 5 images at once

  // Auto-scroll animation
  useEffect(() => {
    if (images.length <= imagesPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (images.length - imagesPerView + 1))
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (!images || images.length === 0) return null

  const visibleImages = images.slice(currentIndex, currentIndex + imagesPerView)

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      {/* Main Images Display - 5 images side by side with animation */}
      <div className="relative">
        <div className="grid grid-cols-5 gap-8 transition-all duration-1000 ease-in-out">
          {visibleImages.map((image, index) => (
            <div key={currentIndex + index} className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm">
              <img
                src={image}
                alt={`${alt} - Imagem ${currentIndex + index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
        
        {/* Image Counter */}
        {images.length > imagesPerView && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {currentIndex + 1}-{Math.min(currentIndex + imagesPerView, images.length)} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}
