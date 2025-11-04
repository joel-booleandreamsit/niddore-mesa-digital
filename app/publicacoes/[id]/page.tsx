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
      capa: publicacao.capa ? assetUrl(publicacao.capa, "fit=cover&width=1600&height=2133&format=webp") : '/placeholder.svg',
      conteudo: publicacao.translations?.[0]?.descricao || 'Conteúdo não disponível',
      paginas: publicacao.paginas || 'N/A',
      edicao: publicacao.edicao || 'N/A',
      autores: autoresNomes
    }

    return (
      <main className="min-h-screen bg-background">
        <BackButton label={labels.back || "Voltar"} />

        <div className="w-full mx-auto px-6 lg:px-8 xl:px-10 2xl:px-22 py-10 md:py-46">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 xl:gap-16 2xl:gap-16">
            {/* Cover Image */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="h-[calc(100vh-18rem)] rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={transformedPublicacao.capa || "/placeholder.svg"}
                    alt={transformedPublicacao.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col gap-8">
                <div className="space-y-4">
                  <span className="inline-block px-12 py-6 text-2xl lg:text-3xl 2xl:text-5xl bg-secondary text-secondary-foreground rounded-full">
                    {transformedPublicacao.tipo}
                  </span>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl text-foreground text-balance leading-tight">
                    {transformedPublicacao.nome}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-6 text-xl md:text-2xl 2xl:text-3xl text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div>
                      {Array.isArray(transformedPublicacao.autores) ? 
                        transformedPublicacao.autores.map((autor, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Users className="w-7 h-7 lg:w-8 lg:h-8 mt-1" />
                            <span>{autor}</span>
                          </div>
                        )) : 
                        <div className="flex items-center gap-2">
                          <Users className="w-7 h-7 lg:w-8 lg:h-8 mt-1" />
                          <span>{transformedPublicacao.autores}</span>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="flex items-start gap-3 lg:ml-16 xl:ml-24 2xl:ml-52">
                    <Calendar className="w-7 h-7 lg:w-8 lg:h-8 mt-1" />
                    <span>{transformedPublicacao.ano}</span>
                  </div>
                </div>

                <div className="relative prose prose-3xl max-w-none mt-10">
                  <div
                    className="h-[84rem] overflow-y-auto pr-4 text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformedPublicacao.conteudo }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  
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
