import { BackButton } from "@/components/back-button"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { assetUrl } from "@/lib/directus"
import { fetchMaterialById } from '@/lib/directus'
import { ScrollFade } from "@/components/scroll-fade"

export const dynamic = 'force-dynamic'

export default async function MaterialDetalhePage({ params, searchParams }: { params: { id: string }, searchParams?: { tipo?: string } }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const sParam = await searchParams
    const tipoParam = sParam?.tipo
    const tipo: 'Material' | 'Trabalho' = tipoParam === 'Trabalho' ? 'Trabalho' : 'Material'

    const material = await fetchMaterialById(id, lang)
    if (!material || (material as any).tipo !== tipo) notFound()

    const nome = material.translations?.[0]?.nome || labels.nameUnavailable
    const descricao = material.translations?.[0]?.descricao || ''
    const capa = material.capa ? assetUrl(material.capa, "fit=cover&width=1600&height=2133&format=webp") : '/placeholder.svg'
    const categoriaNome = material.categoria?.translations?.[0]?.nome || null

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton label={labels.back} />

        <div className="w-full mx-auto px-6 lg:px-8 xl:px-10 2xl:px-22 py-10 md:pt-46">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 xl:gap-16 2xl:gap-16">
            {/* Cover Image */}
            <div className="lg:col-span-7">
              <div className="sticky top-24">
                <div className="h-[calc(100vh-18rem)] rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={capa}
                    alt={nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 h-[calc(100vh-18rem)] flex flex-col gap-8 overflow-hidden">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-block px-12 py-6 text-2xl lg:text-3xl 2xl:text-5xl bg-secondary/40 text-secondary-foreground rounded-full">
                      {tipo}
                    </span>

                    {categoriaNome && (
                      <span className="inline-block px-12 py-6 text-2xl lg:text-3xl 2xl:text-5xl bg-secondary text-secondary-foreground rounded-full">
                        {categoriaNome}
                      </span>
                    )}
                    
                  </div>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl text-foreground text-balance leading-tight">
                    {nome}
                  </h1>
                </div>

                <div className="border-t flex-1 min-h-0 mt-6 pt-4 pb-4">
                  <ScrollFade
                    html={descricao}
                    containerClassName="relative prose prose-3xl max-w-none h-full"
                    contentClassName="h-full overflow-y-auto pr-4 text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
