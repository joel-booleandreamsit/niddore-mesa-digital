import { BackButton } from "@/components/back-button"
import { t, getLang } from "@/lib/i18n"
import fetchEdificios, { assetUrl } from "@/lib/directus"
import { fetchMateriaisLinksForEdificios } from '@/lib/directus'
import { fetchMateriaisCategorias } from '@/lib/directus'
import MateriaisCategoriasClient from "@/components/materiais-categorias-client"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriasPage() {
  const lang = await getLang()
  const labels = t(lang)

  const [categorias, edificios, links] = await Promise.all([
    fetchMateriaisCategorias(lang),
    fetchEdificios(lang),
    fetchMateriaisLinksForEdificios(),
  ])

  const categoriasTransformed = categorias.map((c: any) => ({
    id: c.id,
    nome: c.translations?.[0]?.nome || 'Nome não disponível',
    foto_url: c.imagem ? assetUrl(c.imagem, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
  }))

  const edificiosTransformed = edificios.map((e: any) => ({
    id: e.id,
    nome: e.translations?.[0]?.nome || '—',
  }))

  const linksTransformed = links
    .filter((l: any) => l.categoria?.id && l.edificio?.id)
    .map((l: any) => ({ categoriaId: l.categoria.id, edificioId: l.edificio.id }))

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      <BackButton label={labels.back || "Voltar"} />

      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            {labels.materials || "Materiais"}
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">Categorias</p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <MateriaisCategoriasClient
          categorias={categoriasTransformed}
          edificios={edificiosTransformed}
          links={linksTransformed}
          labels={labels}
        />
      </div>
    </main>
  )
}
