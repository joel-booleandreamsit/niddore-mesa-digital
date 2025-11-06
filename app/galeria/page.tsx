import { BackButton } from "@/components/back-button"
import { fetchGaleriaCategorias, fetchGaleriaFotosByCategoriaIds, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import Link from "next/link"
import { Folder, Image as ImageIcon } from "lucide-react"
 

export const dynamic = 'force-dynamic'

export default async function GaleriaPage() {
  const lang = await getLang()
  const labels = t(lang)
  
  // Fetch root categories
  const categorias = await fetchGaleriaCategorias(lang)

  // Fetch photos that belong to root categories
  const categoriaIds = categorias.map((c: any) => c.id)
  const fotos = await fetchGaleriaFotosByCategoriaIds(categoriaIds, lang)

  // Transform categories data
  const categoriasTransformadas = categorias.map((item: any) => ({
    ...item,
    nome: item.translations?.[0]?.nome || 'Nome não disponível',
    foto_url: item.imagem ? assetUrl(item.imagem, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
  }))

  // Transform photos data
  const fotosTransformadas = fotos.map((item: any) => ({
    ...item,
    breve_descricao: item.translations?.[0]?.breve_descricao || 'Descrição não disponível',
    foto_url: item.foto ? assetUrl(item.foto, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
  }))

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      <BackButton label={labels.back || "Voltar"} />
      
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            {labels.gallery || "Galeria"}
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.galleryDesc || "Galeria de fotos da escola"}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="px-20 pb-24 space-y-20 mt-16">
          {/* 4K Optimized Categories Grid - 8 cards visible */}
          <div className="grid grid-cols-4 gap-16">
            {categoriasTransformadas.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/galeria/categoria/${categoria.id}`}
                className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={categoria.foto_url}
                    alt={categoria.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-10 space-y-6 mb-10">
                  <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight flex items-center gap-4">
                    <Folder className="w-10 h-10 text-muted-foreground" />
                    {categoria.nome}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {fotosTransformadas.length > 0 && (
            <div className="mt-24 space-y-10">
              <h2 className="font-serif text-5xl text-foreground">{labels.photos || "Fotos"}</h2>
              <div className="grid grid-cols-4 gap-16">
                {fotosTransformadas.map((foto) => (
                  <Link
                    key={foto.id}
                    href={`/galeria/${foto.id}`}
                    className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={foto.foto_url}
                        alt={foto.breve_descricao}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-10 space-y-6 mb-10">
                      <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight flex items-center gap-4">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        {foto.breve_descricao}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categoriasTransformadas.length === 0 && (
            <div className="text-center py-32">
              <p className="text-4xl text-muted-foreground font-medium">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}