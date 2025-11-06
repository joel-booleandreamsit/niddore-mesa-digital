"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 365) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`
}

export default function HomePage() {
  const [lang, setLang] = useState<"pt" | "en">("pt")

  // Initialize language from cookie
  useEffect(() => {
    const saved = getCookie("lang")
    if (saved === "pt" || saved === "en") setLang(saved)
  }, [])

  // Helper to change language and persist cookie
  function changeLang(next: "pt" | "en") {
    setLang(next)
    setCookie("lang", next)   
  }

  const sections = [
    {
      title: lang === "pt" ? "Edifícios" : "Buildings",
      description: lang === "pt" ? "Instalações ao longo da história" : "Facilities throughout history",
      href: "/edificios",
      image: "/images/edificios.jpg",
    },
    {
      title: lang === "pt" ? "Cursos" : "Courses",
      description: lang === "pt" ? "Disciplinas lecionadas" : "Subjects taught",
      href: "/cursos",
      image: "/images/cursos.jpg",
    },
    {
      title: lang === "pt" ? "Publicações" : "Publications",
      description: lang === "pt" ? "Publicações da escola" : "School publications",
      href: "/publicacoes",
      image: "/images/publicacoes.jpg",
    },
    {
      title: lang === "pt" ? "Serviços" : "Services",
      description: lang === "pt" ? "Serviços oferecidos pela escola" : "Services offered by the school",
      href: "/servicos",
      image: "/images/servicos.jpg",
    },
    {
      title: lang === "pt" ? "Grupos" : "Groups",
      description: lang === "pt" ? "Grupos da escola" : "School groups",
      href: "/grupos",
      image: "/images/materiais.jpg",
    },
    {
      title: lang === "pt" ? "Galeria de Fotos" : "Photo Gallery",
      description: lang === "pt" ? "Memórias visuais da escola" : "Visual memories of the school",
      href: "/galeria",
      image: "/images/galeria.jpg",
    },
    {
      title: lang === "pt" ? "Documentos" : "Documents",
      description: lang === "pt" ? "Categorias de documentos" : "Document categories",
      href: "/documentos",
      image: "/images/publicacoes.jpg",
    },
    {
      title: lang === "pt" ? "Alunos" : "Students",
      description: lang === "pt" ? "Categorias de documentos" : "Document categories",
      href: "/alunos",
      image: "/images/publicacoes.jpg",
    },
    {
      title: lang === "pt" ? "Pessoal" : "Workforce",
      description: lang === "pt" ? "Categorias de documentos" : "Document categories",
      href: "/pessoal",
      image: "/images/publicacoes.jpg",
    },
  ]

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Language Toggle - Large and Prominent */}
      <div className="absolute top-10 right-16 z-10 flex gap-6">
        <button
          onClick={() => changeLang("pt")}
          className={`px-12 py-6 rounded-2xl border-2 text-3xl font-semibold transition-all duration-200 ${
            lang === "pt" 
              ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.02]" 
              : "bg-card/90 hover:bg-card text-foreground/90 border-border hover:border-primary/40 hover:scale-[1.02]"
          }`}
          aria-label="Português"
        >
          PT
        </button>
        <button
          onClick={() => changeLang("en")}
          className={`px-12 py-6 rounded-2xl border-2 text-3xl font-semibold transition-all duration-200 ${
            lang === "en" 
              ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.02]" 
              : "bg-card/90 hover:bg-card text-foreground/90 border-border hover:border-primary/40 hover:scale-[1.02]"
          }`}
          aria-label="English"
        >
          EN
        </button>
      </div>

      {/* Hero Section - Compact */}
      <div className="relative flex flex-col items-center justify-center px-12 pt-32 pb-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-foreground tracking-normal text-balance leading-none" style={{ fontFamily: 'DearScript, cursive', fontWeight: 'normal', letterSpacing: '16px' }}>
            Domingos Rebelo
          </h1>
          <p className="pt-6 text-2xl md:text-6xl text-primary/80 font-serif italic text-balance">{lang === "pt" ? "Escola Secundária" : "Secondary School"}</p>
          <p className="text-xl md:text-4xl text-muted-foreground/80 text-balance">
            {lang === "pt" ? "Sentir a nossa identidade" : "Discover the history and cultural legacy"}
          </p>
        </div>
      </div>

      {/* Navigation Grid - Now with 7 sections */}
      <div className="flex-1 px-16 pt-8 pb-16">
        <div className="h-full grid grid-cols-3 grid-rows-3 gap-16">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative rounded-2xl overflow-hidden touch-manipulation transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
            >
              <div className="absolute inset-0">
                <img
                  src={section.image || "/placeholder.svg"}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/20 transition-all duration-500" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-8 md:p-10 lg:p-12">
                <div className="space-y-3">
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white group-hover:text-primary transition-colors duration-300 text-balance leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-white/80 group-hover:text-white transition-colors duration-300 text-balance leading-relaxed">
                    {section.description}
                  </p>                  
                </div>
              </div>

              <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
