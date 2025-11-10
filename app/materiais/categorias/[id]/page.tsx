import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { assetUrl } from "@/lib/directus"
import { fetchMateriaisByCategoria } from '@/lib/directus'
import { fetchMateriaisCategoriaById } from '@/lib/directus'
import fetchEdificios from "@/lib/directus"
import MateriaisCategoriaClient from "@/components/materiais-categoria-client"

export const dynamic = 'force-dynamic'

export default async function MateriaisCategoriaPage({ params, searchParams }: { params: { id: string }, searchParams?: { tipo?: string } }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const sParam = await searchParams
  const tipoParam = sParam?.tipo
    const tipo: 'Material' | 'Trabalho' = tipoParam === 'Trabalho' ? 'Trabalho' : 'Material'

    const [categoria, materiais, edificios] = await Promise.all([
      fetchMateriaisCategoriaById(id, lang),
      fetchMateriaisByCategoria(id, lang, tipo),
      fetchEdificios(lang),
    ])

    if (!categoria) notFound()

    const categoriaNome = categoria.translations?.[0]?.nome || labels.nameUnavailable

    const materiaisTransformados = (materiais || []).map((m: any) => ({
      id: m.id,
      nome: m.translations?.[0]?.nome || labels.nameUnavailable,
      breve: m.translations?.[0]?.breve_descricao || '',
      foto_url: m.capa ? assetUrl(m.capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
      edificioId: m.edificio?.id ?? null,
    }))

    const edificiosTransformed = (edificios || []).map((e: any) => ({
      id: e.id,
      nome: e.translations?.[0]?.nome || '—',
    }))

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton label={labels.back} />
        <PageHeader title={categoriaNome} description={labels.gallery} />

        <MateriaisCategoriaClient
          items={materiaisTransformados}
          edificios={edificiosTransformed}
          labels={labels}
          tipo={tipo}
        />
      </main>
    )
  } catch (error) {
    notFound()
  }
}
