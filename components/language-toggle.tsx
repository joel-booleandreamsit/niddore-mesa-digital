"use client"

import { useRouter } from "next/navigation"

interface LanguageToggleProps {
  currentLang: "pt" | "en"
}

export function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const router = useRouter()

  function changeLang(next: "pt" | "en") {
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }

  return (
    <button
      onClick={() => changeLang(currentLang === "pt" ? "en" : "pt")}
      className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl border-2 "
      aria-label={currentLang === "pt" ? "Switch to English" : "Mudar para Português"}
      title={currentLang === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <span className="text-6xl md:text-7xl lg:text-8xl leading-none">{currentLang === "pt" ? "🇬🇧" : "🇵🇹"}</span>
    </button>
  )
}
