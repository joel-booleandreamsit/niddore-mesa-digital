import { BackButton } from "@/components/back-button"
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
      breve: m.translations?.[0]?.breve_descricao || labels.descriptionUnavailable,
      foto_url: m.capa ? assetUrl(m.capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
      edificioId: m.edificio?.id ?? null,
    }))

    const edificiosTransformed = (edificios || []).map((e: any) => ({
      id: e.id,
      nome: e.translations?.[0]?.nome || labels.nameUnavailable,
    }))

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back} />

        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaNome}
            </h1>
            <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.gallery}</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <MateriaisCategoriaClient
            items={materiaisTransformados}
            edificios={edificiosTransformed}
            labels={labels}
            tipo={tipo}
          />
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
