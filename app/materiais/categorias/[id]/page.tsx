import { BackButton } from "@/components/back-button"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { assetUrl } from "@/lib/directus"
import { fetchMateriaisCategoriaById, fetchMateriaisByCategoria } from "@/lib/materials"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)

    const [categoria, materiais] = await Promise.all([
      fetchMateriaisCategoriaById(id, lang),
      fetchMateriaisByCategoria(id, lang),
    ])

    if (!categoria) notFound()

    const categoriaNome = categoria.translations?.[0]?.nome || 'Nome não disponível'

    const materiaisTransformados = (materiais || []).map((m: any) => ({
      id: m.id,
      nome: m.translations?.[0]?.nome || 'Nome não disponível',
      breve: m.translations?.[0]?.breve_descricao || '',
      foto_url: m.capa ? assetUrl(m.capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back || "Voltar"} />

        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaNome}
            </h1>
            <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.gallery || 'Galeria'}</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="px-20 pb-24 space-y-20 mt-16">
            <div className="grid grid-cols-4 gap-16">
              {materiaisTransformados.map((item) => (
                <Link
                  key={item.id}
                  href={`/materiais/${item.id}`}
                  className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.foto_url}
                      alt={item.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-10 space-y-6">
                    <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                      {item.nome}
                    </h3>
                    {item.breve && (
                      <p className="text-2xl text-foreground/80 leading-relaxed">{item.breve}</p>
                    )}
                    <div className="flex items-center gap-4 text-primary pt-4">
                      <span className="text-2xl font-medium">{labels.viewDetails || "Ver detalhes"}</span>
                      <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {materiaisTransformados.length === 0 && (
              <div className="text-center py-32">
                <p className="text-4xl text-muted-foreground font-medium">Nenhum material encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
