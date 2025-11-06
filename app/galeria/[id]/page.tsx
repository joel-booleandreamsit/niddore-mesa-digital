import { BackButton } from "@/components/back-button"
import { fetchGaleriaFotoById, fetchGaleriaCategoriaById, assetUrl } from "@/lib/directus"
import { Folder, Image as ImageIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function GaleriaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const foto = await fetchGaleriaFotoById(id, lang)

    // Transform data to match expected format
    const transformedFoto = {
      ...foto,
      breve_descricao: foto.translations?.[0]?.breve_descricao || 'Descrição não disponível',
      descricao: foto.translations?.[0]?.descricao || 'Descrição não disponível',
      categoria_nome: foto.categoria?.translations?.[0]?.nome || 'Categoria não disponível',
      categoria_id: foto.categoria?.id || null,
      foto_url: foto.foto ? assetUrl(foto.foto, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
    }

    // Build breadcrumb chain up to root: Root > ... > Category > Foto
    const breadcrumbs: Array<{ id: number; nome: string }> = []
    if (transformedFoto.categoria_id) {
      let current = await fetchGaleriaCategoriaById(transformedFoto.categoria_id, lang)
      while (current) {
        breadcrumbs.unshift({ id: current.id, nome: current.translations?.[0]?.nome || 'Categoria' })
        const parentId = current.categoria_principal?.id
        if (!parentId) break
        current = await fetchGaleriaCategoriaById(parentId, lang)
      }
    }

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton label={labels.back || "Voltar"} />

        {/* 4K Optimized Layout */}
        <div className="w-full px-16 pt-32 pb-20">
          <div className="max-w-none mx-auto">
            {/* Header Section */}
            <div className="mb-16">
              <h1 className="font-serif text-9xl text-foreground text-balance leading-tight mb-8 flex items-center gap-6">
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                {transformedFoto.breve_descricao}
              </h1>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-4 text-3xl text-muted-foreground mb-8">
                {breadcrumbs.map((bc, idx) => (
                  <span key={bc.id} className="flex items-center gap-4">
                    {idx > 0 && <span>&gt;</span>}
                    <a href={`/galeria/categoria/${bc.id}`} className="hover:text-primary flex items-center gap-2">
                      <Folder className="w-6 h-6" />
                      {bc.nome}
                    </a>
                  </span>
                ))}
                {breadcrumbs.length > 0 && <span className="mx-2">&gt;</span>}
                <span className="text-foreground flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  {transformedFoto.breve_descricao}
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-16">
              {/* Photo - Takes 8 columns */}
              <div className="col-span-8">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={transformedFoto.foto_url}
                      alt={transformedFoto.breve_descricao}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content - Takes 4 columns */}
              <div className="col-span-4 space-y-16">
                {/* Description */}
                <div className="prose prose-3xl max-w-none">
                  <div 
                    className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformedFoto.descricao }}
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
