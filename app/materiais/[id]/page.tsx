import { BackButton } from "@/components/back-button"
import { fetchMaterialById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function MaterialDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const material = await fetchMaterialById(id, lang)

    if (!material) {
      notFound()
    }

    // Transform data to match expected format
    const transformedMaterial = {
      ...material,
      nome: material.translations?.[0]?.nome || 'Nome não disponível',
      breve_descricao: material.translations?.[0]?.breve_descricao || '',
      descricao: material.translations?.[0]?.descricao || 'Descrição não disponível',
      categoria_nome: material.categoria?.translations?.[0]?.nome || 'Categoria não disponível',
      edificio_nome: material.edificio?.translations?.[0]?.nome || 'Edifício não disponível',
      foto_url: material.capa ? assetUrl(material.capa, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
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
                {transformedMaterial.nome}
              </h1>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-4 text-3xl text-muted-foreground mb-8">
                <span>{transformedMaterial.categoria_nome}</span>
                {transformedMaterial.edificio_nome && (
                  <>
                    <span>/</span>
                    <span>{transformedMaterial.edificio_nome}</span>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-16">
              {/* Photo - Takes 8 columns */}
              <div className="col-span-8">
                <div className="sticky top-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={transformedMaterial.foto_url}
                      alt={transformedMaterial.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content - Takes 4 columns */}
              <div className="col-span-4 space-y-16">
                {/* Brief Description */}
                {transformedMaterial.breve_descricao && (
                  <p className="text-4xl text-primary/90 font-serif italic leading-relaxed">
                    {transformedMaterial.breve_descricao}
                  </p>
                )}
                
                {/* Description */}
                <div className="prose prose-3xl max-w-none">
                  <div 
                    className="text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                    dangerouslySetInnerHTML={{ __html: transformedMaterial.descricao }}
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
