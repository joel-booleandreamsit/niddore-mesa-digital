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
      className="fixed top-10 left-10 z-50 flex items-center gap-4 px-8 py-6 bg-card/90 border-2 border-border rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 touch-manipulation active:scale-95 shadow-lg"
    >
      <ArrowLeft className="w-12 h-12" />
      <span className="text-4xl font-medium">{label}</span>
    </button>
  )
}
