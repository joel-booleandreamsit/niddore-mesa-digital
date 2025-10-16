import { BackButton } from "@/components/back-button"
import { fetchPublicacaoById, assetUrl, stripHtml } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"
import { Calendar, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PublicacaoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const publicacao = await fetchPublicacaoById(id, lang)

    // Extract author names from the autores data
    const autoresNomes = publicacao.autores?.map((autor: any) => autor.Autores_id?.nome).filter(Boolean) || ['Autor não disponível']

    // Transform data to match expected format
    const transformedPublicacao = {
      ...publicacao,
      nome: publicacao.nome || 'Nome não disponível',
      descricao: publicacao.translations?.[0]?.breve_descricao || 'Descrição não disponível',
      tipo: publicacao.tipo_publicacao_translated || publicacao.tipo_publicacao || 'Tipo não disponível',
      ano: publicacao.ano_publicacao || new Date().getFullYear(),
      capa: publicacao.capa ? assetUrl(publicacao.capa, "fit=cover&width=600&height=800&format=webp") : '/placeholder.svg',
      conteudo: publicacao.translations?.[0]?.descricao || 'Conteúdo não disponível',
      paginas: publicacao.paginas || 'N/A',
      edicao: publicacao.edicao || 'N/A',
      autores: autoresNomes
    }

    return (
      <main className="min-h-screen bg-background">
        <BackButton label={labels.back || "Voltar"} />

        <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16">
            {/* Cover Image */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={transformedPublicacao.capa || "/placeholder.svg"}
                    alt={transformedPublicacao.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-5 py-2 text-lg md:text-xl bg-secondary text-secondary-foreground rounded-full">
                  {transformedPublicacao.tipo}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance leading-tight">
                  {transformedPublicacao.nome}
                </h1>
              </div>

              <div className="flex flex-wrap gap-6 text-lg md:text-xl text-muted-foreground">
                <div className="flex items-start gap-3">
                  
                  <div>
                    {Array.isArray(transformedPublicacao.autores) ? 
                      transformedPublicacao.autores.map((autor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Users className="w-6 h-6 mt-1" />
                          <span>{autor}</span>
                        </div>
                      )) : 
                      <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 mt-1" />
                        <span>{transformedPublicacao.autores}</span>
                      </div>
                    }
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 mt-1" />
                  <span>{transformedPublicacao.ano}</span>
                </div>
              </div>

              <div className="border-t border-border pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg text-muted-foreground mb-2">Páginas</p>
                    <p className="text-2xl md:text-3xl font-serif text-foreground">{transformedPublicacao.paginas}</p>
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground mb-2">Edição</p>
                    <p className="text-2xl md:text-3xl font-serif text-foreground">{transformedPublicacao.edicao}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Sobre esta publicação</h2>
                <div 
                  className="text-lg md:text-xl text-foreground/80 leading-relaxed prose prose-lg max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_ul]:pl-6 [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: transformedPublicacao.conteudo }}
                />
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
