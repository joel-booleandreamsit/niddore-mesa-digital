import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { t, getLang } from "@/lib/i18n"
import fetchEdificios, { assetUrl } from "@/lib/directus"
import { fetchMateriaisLinksForEdificios } from '@/lib/directus'
import { fetchMateriaisCategorias } from '@/lib/directus'
import MateriaisCategoriasClient from "@/components/materiais-categorias-client"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriasPage({ searchParams }: { searchParams?: { tipo?: string } }) {
  const lang = await getLang()
  const labels = t(lang)
  const sParam = await searchParams
  const tipoParam = sParam?.tipo
  const tipo: 'Material' | 'Trabalho' = tipoParam === 'Trabalho' ? 'Trabalho' : 'Material'

  const [categorias, edificios, links] = await Promise.all([
    fetchMateriaisCategorias(lang),
    fetchEdificios(lang),
    fetchMateriaisLinksForEdificios(tipo),
  ])

  const categoriasTransformed = categorias.map((c: any) => ({
    id: c.id,
    nome: c.translations?.[0]?.nome || labels.nameUnavailable,
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
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton label={labels.back} />
      <PageHeader title={tipo === 'Trabalho' ? labels.works : labels.materials} description="Categorias" />

      <MateriaisCategoriasClient
        categorias={categoriasTransformed}
        edificios={edificiosTransformed}
        links={linksTransformed}
        labels={labels}
        tipo={tipo}
      />
    </main>
  )
}
