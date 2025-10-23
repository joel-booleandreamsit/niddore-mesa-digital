import { BackButton } from "@/components/back-button"
import { fetchGaleriaFotoById, assetUrl } from "@/lib/directus"
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
      categoria_principal_nome: foto.categoria?.categoria_principal?.translations?.[0]?.nome || null,
      foto_url: foto.foto ? assetUrl(foto.foto, "fit=cover&width=1200&height=800&format=webp") : '/placeholder.svg',
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
                {transformedFoto.breve_descricao}
              </h1>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-4 text-3xl text-muted-foreground mb-8">
                {transformedFoto.categoria_principal_nome && (
                  <>
                    <span>{transformedFoto.categoria_principal_nome}</span>
                    <span>/</span>
                  </>
                )}
                <span>{transformedFoto.categoria_nome}</span>
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
