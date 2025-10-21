import { BackButton } from "@/components/back-button"
import { ImageCarousel } from "@/components/image-carousel"
import { fetchServicoById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"
import { Calendar, Clock, Image as ImageIcon } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ServicoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const servico = await fetchServicoById(id, lang)

    // Transform data to match expected format
    const transformedServico = {
      ...servico,
      nome: servico.translations?.[0]?.nome || 'Nome não disponível',
      descricao: servico.translations?.[0]?.descricao || 'Descrição não disponível',
      data_inicio: servico.data_inicio || null,
      data_fim: servico.data_fim || null,
      foto_capa: servico.foto_capa ? assetUrl(servico.foto_capa, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
      fotos_galeria: servico.fotos_galeria ? servico.fotos_galeria.map((foto: any) => foto.directus_files_id).filter(Boolean).map((fotoId: string) => assetUrl(fotoId, "fit=cover&width=1600&height=1000&format=webp")) : [],
      isActive: !servico.data_fim,
    }

    const formatDate = (dateString: string | null) => {
      if (!dateString) return null
      return new Date(dateString).toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return (
      <main className="min-h-screen bg-background">
        <BackButton label={labels.back || "Voltar"} />

        {/* 4K Optimized Layout */}
        <div className="w-full px-16 pt-32 pb-20">
          <div className="max-w-none mx-auto">
            {/* Header Section */}
            <div className="mb-16">
              <h1 className="font-serif text-9xl text-foreground text-balance leading-tight mb-8">
                {transformedServico.nome}
              </h1>
            </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-16">
              {/* Cover Image - Takes 5 columns */}
              <div className="col-span-5">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={transformedServico.foto_capa}
                      alt={transformedServico.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content - Takes 7 columns */}
              <div className="col-span-7 space-y-16">
                {/* Date Information - Above Description */}
                <div className="flex flex-wrap gap-12 text-4xl text-muted-foreground">
                  <div className="flex items-center gap-6">
                    <Calendar className="w-12 h-12" />
                    <div>
                      <p className="text-2xl text-muted-foreground mb-2">{labels.startDate || "Data de início"}</p>
                      <span className="text-5xl font-medium">{formatDate(transformedServico.data_inicio) || 'N/A'}</span>
                    </div>
                  </div>
                  {transformedServico.data_fim && (
                    <div className="flex items-center gap-6">
                      <Clock className="w-12 h-12" />
                      <div>
                        <p className="text-2xl text-muted-foreground mb-2">{labels.endDate || "Data de fim"}</p>
                        <span className="text-5xl font-medium">{formatDate(transformedServico.data_fim)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="prose prose-3xl max-w-none">
                  <div 
                    className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformedServico.descricao }}
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section - Normal Flow */}
            {transformedServico.fotos_galeria && transformedServico.fotos_galeria.length > 0 && (
              <div className="mt-24">
                <ImageCarousel 
                  images={transformedServico.fotos_galeria}
                  alt={transformedServico.nome}
                  className="w-full"
                />
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
