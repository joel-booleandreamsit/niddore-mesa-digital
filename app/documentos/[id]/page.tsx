import { BackButton } from "@/components/back-button"
import { fetchDocumentoById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"
import { Calendar, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DocumentoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const documento = await fetchDocumentoById(id, lang)

    const formatDate = (dateString: string | null) => {
      if (!dateString) return null
      return new Date(dateString).toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    }

    const autoresNomes =
      documento.autores?.map((autor: any) => autor.Autores_id?.nome).filter(Boolean) || ['Autor não disponível']

    const transformed = {
      ...documento,
      nome: documento.translations?.[0]?.nome || 'Nome não disponível',
      descricao: documento.translations?.[0]?.descricao || 'Conteúdo não disponível',
      data_fmt: formatDate(documento.data),
      capa_url: documento.capa ? assetUrl(documento.capa, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
      autores: autoresNomes,
      categoria_nome: documento.categoria?.translations?.[0]?.nome || null,
    }

    return (
      <main className="min-h-screen bg-background">
        <BackButton label={labels.back || "Voltar"} />

        <div className="w-full px-16 pt-32 pb-20">
          <div className="max-w-none mx-auto">
            <div className="mb-16">
              <h1 className="font-serif text-9xl text-foreground text-balance leading-tight mb-8">{transformed.nome}</h1>

              <div className="flex items-center gap-6 text-3xl text-muted-foreground mb-8">
                {transformed.categoria_nome && <span>{transformed.categoria_nome}</span>}
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <span>{transformed.data_fmt || '—'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <span>{Array.isArray(transformed.autores) ? transformed.autores.join('; ') : transformed.autores}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-16">
              <div className="col-span-8">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img src={transformed.capa_url} alt={transformed.nome} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="col-span-4 space-y-16">
                <div className="prose prose-3xl max-w-none">
                  <div
                    className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformed.descricao }}
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="font-serif text-5xl text-foreground">Autores</h2>
                  <ul className="list-disc pl-8 text-3xl text-foreground/80">
                    {Array.isArray(transformed.autores) ? (
                      transformed.autores.map((a: string, i: number) => <li key={i}>{a}</li>)
                    ) : (
                      <li>{transformed.autores}</li>
                    )}
                  </ul>
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
