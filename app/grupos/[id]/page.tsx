import { BackButton } from "@/components/back-button"
import { ImageCarousel } from "@/components/image-carousel"
import { fetchGrupoById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function GrupoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const grupo = await fetchGrupoById(id, lang)

    // Transform data to match expected format
    const transformedGrupo = {
      ...grupo,
      nome: grupo.translations?.[0]?.nome || 'Nome não disponível',
      descricao: grupo.translations?.[0]?.descricao || 'Descrição não disponível',
      tipo_grupo: grupo.tipo_grupo_translated || grupo.tipo_grupo || 'Tipo não disponível',
      foto_capa: grupo.foto_capa ? assetUrl(grupo.foto_capa, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
      fotos_galeria: grupo.fotos_galeria ? grupo.fotos_galeria.map((foto: any) => ({
        id: foto.directus_files_id?.id || foto.directus_files_id,
        url: assetUrl(foto.directus_files_id?.id || foto.directus_files_id, "fit=cover&width=1600&height=1000&format=webp"),
        title: foto.directus_files_id?.title || '',
        description: foto.directus_files_id?.description || ''
      })).filter((foto: any) => foto.id) : [],
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
                {transformedGrupo.nome}
              </h1>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-16">
              {/* Cover Image - Takes 5 columns */}
              <div className="col-span-5">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={transformedGrupo.foto_capa}
                      alt={transformedGrupo.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content - Takes 7 columns */}
              <div className="col-span-7 space-y-16">
                {/* Description */}
                <div className="prose prose-3xl max-w-none">
                  <div 
                    className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformedGrupo.descricao }}
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section - Normal Flow */}
            {transformedGrupo.fotos_galeria && transformedGrupo.fotos_galeria.length > 0 && (
              <div className="mt-24">
                <ImageCarousel 
                  images={transformedGrupo.fotos_galeria}
                  alt={transformedGrupo.nome}
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
