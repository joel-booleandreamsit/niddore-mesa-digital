"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { ChevronUp, ChevronDown } from "lucide-react"

const galleryImages = [
  { src: "/images/gallery/photo-1.jpg", alt: "Fotografia histórica 1" },
  { src: "/images/gallery/photo-2.jpg", alt: "Fotografia histórica 2" },
  { src: "/images/gallery/photo-3.jpg", alt: "Fotografia histórica 3" },
  { src: "/images/gallery/photo-4.jpg", alt: "Fotografia histórica 4" },
  { src: "/images/gallery/photo-5.jpg", alt: "Fotografia histórica 5" },
  { src: "/images/gallery/photo-6.jpg", alt: "Fotografia histórica 6" },
  { src: "/images/gallery/photo-7.jpg", alt: "Fotografia histórica 7" },
  { src: "/images/gallery/photo-8.jpg", alt: "Fotografia histórica 8" },
  { src: "/images/gallery/photo-9.jpg", alt: "Fotografia histórica 9" },
  { src: "/images/gallery/photo-10.jpg", alt: "Fotografia histórica 10" },
]

export default function GaleriaPage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <BackButton />
      </div>

      {/* Image Counter */}
      <div className="absolute top-8 right-8 z-50 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
        <p className="text-white text-2xl font-serif">
          {currentIndex + 1} / {galleryImages.length}
        </p>
      </div>

      {/* Main Image Display */}
      <div className="relative h-full w-full">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {/* Up Arrow */}
        <button
          onClick={goToPrevious}
          className="group bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-6 rounded-full transition-all duration-300 touch-manipulation active:scale-95"
          aria-label="Imagem anterior"
        >
          <ChevronUp className="w-12 h-12 text-white group-hover:text-white transition-colors" />
        </button>

        {/* Down Arrow */}
        <button
          onClick={goToNext}
          className="group bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-6 rounded-full transition-all duration-300 touch-manipulation active:scale-95"
          aria-label="Próxima imagem"
        >
          <ChevronDown className="w-12 h-12 text-white group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentIndex ? "w-12 bg-primary" : "w-3 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
