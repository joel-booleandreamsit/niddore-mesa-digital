import { BackButton } from "@/components/back-button"
import { fetchGaleriaCategoriaById, fetchGaleriaSubcategorias, fetchGaleriaFotos, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Folder, Image as ImageIcon } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function GaleriaCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    
    // Fetch current category and its subcategories
    const [categoria, subcategorias] = await Promise.all([
      fetchGaleriaCategoriaById(parseInt(id), lang),
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

    const fotosData = await fetchGaleriaFotos(parseInt(id), lang)

    const fotosTransformadas = fotosData.map((item: any) => ({
      ...item,
      breve_descricao: item.translations?.[0]?.breve_descricao || 'Descrição não disponível',
      foto_url: item.foto ? assetUrl(item.foto, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))

    // Build breadcrumbs up to the root
    const breadcrumbs: Array<{ id: number; nome: string }> = []
    let current: any = categoria
    while (current) {
      breadcrumbs.unshift({ id: current.id, nome: current.translations?.[0]?.nome || 'Categoria' })
      const parentId = current.categoria_principal?.id
      if (!parentId) break
      current = await fetchGaleriaCategoriaById(parentId, lang)
    }

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back || "Voltar"} />
        
        {/* Header Section */}
        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaTransformada.nome}
            </h1>
            <div className="flex items-center justify-center gap-4 text-3xl text-muted-foreground">
              {breadcrumbs.map((bc, idx) => (
                <span key={bc.id} className="flex items-center gap-4">
                  {idx > 0 && <span>&gt;</span>}
                  <Link href={`/galeria/categoria/${bc.id}`} className="hover:text-primary">
                    {bc.nome}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="px-20 pb-24 space-y-20 mt-16">
            {subcategoriasTransformadas.length > 0 && (
              <div className="space-y-10">
                <h2 className="font-serif text-5xl text-foreground">{labels.subcategories || "Sub-Categorias"}</h2>
                <div className="grid grid-cols-4 gap-16">
                  {subcategoriasTransformadas.map((subcategoria) => (
                    <Link
                      key={subcategoria.id}
                      href={`/galeria/categoria/${subcategoria.id}`}
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
                        <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight flex items-center gap-4">
                          <Folder className="w-10 h-10 text-muted-foreground" />
                          {subcategoria.nome}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {fotosTransformadas.length > 0 && (
              <div className="space-y-10">
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
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
