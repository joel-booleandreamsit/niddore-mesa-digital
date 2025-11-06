import { BackButton } from "@/components/back-button"
import { fetchGaleriaCategorias, fetchGaleriaSubcategorias, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function GaleriaCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    
    // Fetch category and its subcategories
    const [categoria, subcategorias] = await Promise.all([
      fetchGaleriaCategorias(lang).then(cats => cats.find(cat => cat.id === parseInt(id))),
      fetchGaleriaSubcategorias(parseInt(id), lang)
    ])

    if (!categoria) {
      notFound()
    }

    // Transform category data
    const categoriaTransformada = {
      ...categoria,
      nome: categoria.translations?.[0]?.nome || 'Nome não disponível',
    }

    // Transform subcategories data
    const subcategoriasTransformadas = subcategorias.map((item: any) => ({
      ...item,
      nome: item.translations?.[0]?.nome || 'Nome não disponível',
      foto_url: item.imagem ? assetUrl(item.imagem, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back || "Voltar"} />
        
        {/* Header Section */}
        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaTransformada.nome}
            </h1>
            <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.subcategory || "Subcategorias"}</p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="px-20 pb-24 space-y-20 mt-16">
            {/* 4K Optimized Subcategories Grid - 8 cards visible */}
            <div className="grid grid-cols-4 gap-16">
              {subcategoriasTransformadas.map((subcategoria) => (
                <Link
                  key={subcategoria.id}
                  href={`/galeria/subcategoria/${subcategoria.id}`}
                  className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={subcategoria.foto_url}
                      alt={subcategoria.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-10 space-y-6 mb-10">
                    <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                      {subcategoria.nome}
                    </h3>
                    
                  </div>
                </Link>
              ))}
            </div>

            {subcategoriasTransformadas.length === 0 && (
              <div className="text-center py-32">
                <p className="text-4xl text-muted-foreground font-medium">Nenhuma subcategoria encontrada nesta categoria.</p>
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
