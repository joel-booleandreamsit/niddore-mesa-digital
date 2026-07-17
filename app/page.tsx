import Link from "next/link"
import Image from "next/image"
import { fetchPaginas, assetUrl } from "@/lib/directus"
import { getLang } from "@/lib/i18n"
import { LanguageToggle } from "@/components/language-toggle"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const lang = await getLang()
  const data = await fetchPaginas(lang)

  const sections = (data || []).map((page: any) => ({
    title: page.translations?.[0]?.titulo || '',
    description: page.translations?.[0]?.descricao || '',
    href: page.href || '/',
    image: assetUrl(page.imagem) || '/placeholder.svg',
  }))

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Language Toggle */}
      <div className="absolute top-10 right-16 z-10">
        <LanguageToggle currentLang={lang} />
      </div>

      {/* Hero Section - Compact */}
      <div className="relative flex flex-col items-center justify-center px-12 pt-32 pb-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-foreground tracking-normal text-balance leading-none" style={{ fontFamily: 'DearScript', fontWeight: 'normal', fontSize: '200px' }}>
            Domingos Rebelo
          </h1>
          <p className="pt-6 text-2xl md:text-6xl text-primary/80 font-serif italic text-balance">{lang === "pt" ? "Escola Secundária" : "Secondary School"}</p>
          <p className="text-xl md:text-4xl text-muted-foreground/80 text-balance">
            {lang === "pt" ? "Sentir a nossa identidade" : "Discover the history and cultural legacy"}
          </p>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="flex-1 px-16 pt-8 pb-16">
        <div className="h-full grid grid-cols-3 grid-rows-3 gap-16">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative rounded-2xl overflow-hidden touch-manipulation transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
            >
              <div className="absolute inset-0">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
