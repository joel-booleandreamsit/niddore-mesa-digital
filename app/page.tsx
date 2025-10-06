"use client"

import Link from "next/link"

export default function HomePage() {
  const sections = [
    {
      title: "Edifícios",
      description: "Instalações ao longo da história",
      href: "/edificios",
      image: "/images/edificios.jpg",
    },
    {
      title: "Cursos",
      description: "Disciplinas lecionadas",
      href: "/cursos",
      image: "/images/cursos.jpg",
    },
    {
      title: "Materiais",
      description: "Materiais utilizados na escola",
      href: "/materiais",
      image: "/images/materiais.jpg",
    },
    {
      title: "Publicações",
      description: "Publicações da escola",
      href: "/publicacoes",
      image: "/images/publicacoes.jpg",
    },
    {
      title: "Galeria de Fotos",
      description: "Memórias visuais da escola",
      href: "/galeria",
      image: "/images/galeria.jpg",
    },
  ]

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Hero Section - Compact */}
      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            Domingos Rebelo
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">Escola Secundária</p>
          <p className="text-xl md:text-2xl text-muted-foreground/80 text-balance">
            Descubra a história e o legado cultural
          </p>
        </div>
      </div>

      {/* Navigation Grid - Now with 5 sections */}
      <div className="flex-1 px-8 pb-8">
        <div className="h-full grid grid-cols-3 grid-rows-2 gap-6">
          {sections.slice(0, 3).map((section) => (
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

                  <div className="flex items-center gap-3 text-base md:text-lg text-primary/80 group-hover:text-primary transition-colors duration-300 pt-2">
                    <span>Toque para explorar</span>
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}

          {sections.slice(3).map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative rounded-2xl overflow-hidden touch-manipulation transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl col-span-1"
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

                  <div className="flex items-center gap-3 text-base md:text-lg text-primary/80 group-hover:text-primary transition-colors duration-300 pt-2">
                    <span>Toque para explorar</span>
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
