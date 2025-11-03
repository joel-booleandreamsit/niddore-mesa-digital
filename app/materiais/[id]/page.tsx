import { BackButton } from "@/components/back-button"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { assetUrl } from "@/lib/directus"
import { fetchMaterialById } from '@/lib/directus'

export const dynamic = 'force-dynamic'

export default async function MaterialDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)

    const material = await fetchMaterialById(id, lang)
    if (!material || (material as any).tipo !== 'Material') notFound()

    const nome = material.translations?.[0]?.nome || 'Nome não disponível'
    const descricao = material.translations?.[0]?.descricao || ''
    const capa = material.capa ? assetUrl(material.capa, "fit=cover&width=2000&height=1400&format=webp") : '/placeholder.svg'

    return (
      <main className="min-h-screen bg-background">
        <BackButton label={labels.back || "Voltar"} />
        <div className="w-full px-16 pt-32 pb-20">
          <div className="max-w-none mx-auto">
            <div className="mb-16">
              <h1 className="font-serif text-9xl text-foreground text-balance leading-tight mb-8">
                {nome}
              </h1>
            </div>
            <div className="grid grid-cols-12 gap-16">
              <div className="col-span-5">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img src={capa} alt={nome} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="col-span-7 space-y-16">
                {descricao && (
                  <div className="prose prose-3xl max-w-none">
                    <div
                      className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                      dangerouslySetInnerHTML={{ __html: descricao }}
                    />
                  </div>
                )}
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
