import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { fetchGaleriaCategoriaById, fetchGaleriaSubcategorias, fetchGaleriaFotos, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Folder, Image as ImageIcon } from "lucide-react"
import GaleriaPhotosClient from "@/components/galeria-photos-client"

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
      nome: categoria.translations?.[0]?.nome || labels.nameUnavailable,
    }

    // Transform subcategories data
    const subcategoriasTransformadas = subcategorias.map((item: any) => ({
      ...item,
      nome: item.translations?.[0]?.nome || labels.nameUnavailable,
      foto_url: item.imagem ? assetUrl(item.imagem, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))

    const fotosData = await fetchGaleriaFotos(parseInt(id), lang)

    const fotosTransformadas = fotosData.map((item: any) => ({
      id: item.id,
      nome: item.translations?.[0]?.nome || item.translations?.[0]?.breve_descricao || labels.nameUnavailable,
      breve: item.translations?.[0]?.breve_descricao || labels.descriptionUnavailable,
      descricao: item.translations?.[0]?.descricao || labels.descriptionUnavailable,
      foto_url: item.foto ? assetUrl(item.foto, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
      foto_url_large: item.foto ? assetUrl(item.foto, "fit=cover&width=1200&height=900&format=webp") : '/placeholder.svg',
    }))

    // Build breadcrumbs up to the root
    const breadcrumbs: Array<{ id: number; nome: string }> = []
    let current: any = categoria
    while (current) {
      breadcrumbs.unshift({ id: current.id, nome: current.translations?.[0]?.nome || labels.category })
      const parentId = current.categoria_principal?.id
      if (!parentId) break
      current = await fetchGaleriaCategoriaById(parentId, lang)
    }

    // Description: 'Galeria' plus ancestors (exclude current). Only add separator if there is at least 1 ancestor (i.e., breadcrumbs.length >= 2)
    const breadcrumbDesc =
      labels.gallery + (breadcrumbs.length >= 2 ? " > " + breadcrumbs.slice(0, -1).map((b) => b.nome).join(" > ") : "")

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton label={labels.back} />
        <PageHeader
          title={categoriaTransformada.nome}
          description={breadcrumbDesc}          
        />

        <div className="flex-1 px-8 pb-8">
          <div className="px-20 pb-24 space-y-20 mt-16">
            {subcategoriasTransformadas.length > 0 && (
              <div className="space-y-10">
                <h2 className="font-serif text-5xl text-foreground">{labels.subcategories || "Sub-Categorias"}</h2>
                <div className="grid grid-cols-4 xl:grid-cols-5 gap-16">
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
                <GaleriaPhotosClient
                  fotos={fotosTransformadas}
                  breadcrumbs={breadcrumbs.map((b) => b.nome)}
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
