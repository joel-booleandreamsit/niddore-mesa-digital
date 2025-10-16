"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  label?: string
}

export function BackButton({ label = "Voltar" }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-8 left-8 z-50 flex items-center gap-3 px-6 py-4 md:px-8 md:py-5 bg-card border-2 border-border rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 touch-manipulation active:scale-95 shadow-lg"
    >
      <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
      <span className="text-xl md:text-2xl font-medium">{label}</span>
    </button>
  )
}
