import { BackButton } from "@/components/back-button"
import { fetchMateriaisCategorias, fetchMateriaisByCategoria, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import MateriaisList from "@/components/materiais-list"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriaPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>,
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const sp = await searchParams
    const edificioParam = sp?.edificio
    const edificioId = Array.isArray(edificioParam) ? edificioParam[0] : edificioParam
    
    // Fetch category and its materials
    const [categoria, materiais] = await Promise.all([
      fetchMateriaisCategorias(lang).then(cats => cats.find((cat: any) => cat.id === parseInt(id))),
      fetchMateriaisByCategoria(parseInt(id), lang, 'Material')
    ])

    if (!categoria) {
      notFound()
    }

    // Transform category data
    const categoriaTransformada = {
      ...categoria,
      nome: categoria.translations?.[0]?.nome || 'Nome não disponível',
    }

    // Transform materials data
    const materiaisTransformados = materiais.map((item: any) => ({
      ...item,
      nome: item.translations?.[0]?.nome || 'Nome não disponível',
      breve_descricao: item.translations?.[0]?.breve_descricao || '',
      foto_url: item.capa ? assetUrl(item.capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))
    
    // For now, we'll use a static list of edificios until we implement the proper filter
    const edificios = [
      { id: 1, nome: "Edifício Principal" },
      { id: 2, nome: "Biblioteca" },
      { id: 3, nome: "Laboratórios" },
      { id: 4, nome: "Pavilhão Desportivo" }
    ]

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back || "Voltar"} />
        
        {/* Header Section */}
        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaTransformada.nome}
            </h1>
            <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">
              {labels.materials || "Materiais"}
            </p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="px-20 pb-24 space-y-20 mt-16">
            <MateriaisList
              materiais={materiaisTransformados}
              labels={{
                viewDetails: labels.viewDetails || "Ver detalhes",
                noMaterialsFound: "Nenhum material encontrado nesta categoria.",
                noMaterialsFoundForBuilding: "Nenhum material encontrado para este edifício nesta categoria."
              }}
              edificios={edificios}
              selectedEdificioId={edificioId}
              categoryId={parseInt(id)}
            />
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
