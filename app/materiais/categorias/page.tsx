import { BackButton } from "@/components/back-button"
import { fetchMateriaisCategorias, assetUrl, fetchMateriais } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriasPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const lang = await getLang()
  const labels = t(lang)
  const sp = await searchParams
  const edificioParam = sp?.edificio
  const edificioId = Array.isArray(edificioParam) ? edificioParam[0] : edificioParam
  
  // Fetch categories data and all materials to check which categories have materials for each building
  const [categorias, materiais] = await Promise.all([
    fetchMateriaisCategorias(lang),
    fetchMateriais(lang, 'Material')
  ])
  
  // For now, we'll use a static list of edificios until we implement the proper filter
  const edificios = [
    { id: 1, translations: [{ nome: "Edifício Principal" }] },
    { id: 2, translations: [{ nome: "Biblioteca" }] },
    { id: 3, translations: [{ nome: "Laboratórios" }] },
    { id: 4, translations: [{ nome: "Pavilhão Desportivo" }] }
  ]

  // Transform categories data
  const categoriasTransformadas = categorias.map((item: any) => {
    // Check if this category has materials for the selected building
    const hasEdificioMateriais = edificioId
      ? materiais.some((m: any) => m.categoria?.id === item.id && String(m.edificio) === String(edificioId))
      : true
      
    return {
      ...item,
      nome: item.translations?.[0]?.nome || 'Nome não disponível',
      foto_url: item.imagem ? assetUrl(item.imagem, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
      hasEdificioMateriais
    }
  })
  
  // Filter categories that have materials for the selected building
  const categoriasFiltered = edificioId
    ? categoriasTransformadas.filter(cat => cat.hasEdificioMateriais)
    : categoriasTransformadas

  // Transform edificios data for filter buttons
  const edificiosTransformados = edificios.map((e: any) => ({
    id: e.id,
    nome: e.translations?.[0]?.nome || String(e.id),
  }))

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      <BackButton label={labels.back || "Voltar"} />
      
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            {labels.materials || "Materiais"}
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">
            {labels.materials ? `${labels.materials} históricos da escola` : "Materiais históricos da escola"}
          </p>
        </div>
      </div>
      
      {/* Building Filter Buttons */}
      <div className="px-20 pt-8">
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/materiais/categorias"
            className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
              !edificioId 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card text-foreground border-border hover:border-primary"}`}
          >
            {labels.allBuildings || "Todos os Edifícios"}
          </Link>
          {edificiosTransformados.slice(0, 5).map((edificio: {id: string | number, nome: string}) => (
            <Link
              key={edificio.id}
              href={`/materiais/categorias?edificio=${edificio.id}`}
              className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
                String(edificioId) === String(edificio.id)
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-foreground border-border hover:border-primary"}`}
            >
              {edificio.nome}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="px-20 pb-24 space-y-20 mt-16">
          {/* 4K Optimized Categories Grid - 8 cards visible */}
          <div className="grid grid-cols-4 gap-16">
            {categoriasFiltered.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/materiais/categorias/${categoria.id}${edificioId ? `?edificio=${edificioId}` : ''}`}
                className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={categoria.foto_url}
                    alt={categoria.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-10 space-y-6">
                  <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                    {categoria.nome}
                  </h3>
                  <div className="flex items-center gap-4 text-primary pt-4">
                    <span className="text-2xl font-medium">{labels.viewDetails || "Ver detalhes"}</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {categoriasFiltered.length === 0 && (
            <div className="text-center py-32">
              <p className="text-4xl text-muted-foreground font-medium">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
