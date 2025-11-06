import { BackButton } from "@/components/back-button"
import { ImageCarousel } from "@/components/image-carousel"
import { fetchGrupoById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"
import { ScrollFade } from "@/components/scroll-fade"

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
      nome: grupo.translations?.[0]?.nome || labels.nameUnavailable,
      descricao: grupo.translations?.[0]?.descricao || labels.descriptionUnavailable,
      tipo_grupo: grupo.tipo_grupo_translated || grupo.tipo_grupo || labels.typeUnavailable,
      foto_capa: grupo.foto_capa ? assetUrl(grupo.foto_capa, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
      fotos_galeria: (() => {
        const g: any = (grupo as any).fotos_galeria
        if (!g) return []
        const arr = Array.isArray(g) ? g : []
        return arr
          .map((it: any) => {
            const df = it?.directus_files_id
            const dfId = typeof df === 'object' ? df?.id : df
            const candidateId = typeof it === 'string' ? it : (dfId || it?.file || it?.ficheiro || it?.foto || it?.imagem || it?.id)
            if (!candidateId || typeof candidateId !== 'string') return null
            const title = it?.titulo || it?.title || it?.nome || it?.name || (typeof df === 'object' ? (df as any)?.title : null) || ''
            const description = it?.descricao || it?.description || (typeof df === 'object' ? (df as any)?.description : null) || ''
            const mime = (typeof df === 'object' && (df?.type || (df as any)?.mime_type)) as string | undefined
            const filename = (typeof df === 'object' && (df as any)?.filename_download) as string | undefined
            const isVideo = (mime && mime.startsWith('video/')) || (filename && filename.toLowerCase().endsWith('.mp4'))
            const url = isVideo
              ? assetUrl(candidateId)
              : assetUrl(candidateId, "fit=cover&format=webp")
            return { id: candidateId, url, title, description, type: isVideo ? 'video' : 'image' as const }
          })
          .filter(Boolean) as any[]
      })(),
    }
        

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton label={labels.back} />

        {/* 4K Optimized Layout */}
        <div className="w-full px-16 pt-32 pb-8">
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
                <ScrollFade
                  html={transformedGrupo.descricao}
                  containerClassName="relative prose prose-3xl max-w-none mt-4"
                  contentClassName="h-[70rem] overflow-y-auto pr-4 text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                />
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
