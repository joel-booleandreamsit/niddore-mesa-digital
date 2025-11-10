import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { fetchGrupos, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import GruposClient from "./grupos-client"

export const dynamic = 'force-dynamic'

export default async function GruposPage() {
  const lang = await getLang()
  const labels = t(lang)
  const data = await fetchGrupos(lang)

  // Transform data to match expected format
  const grupos = data.map((item: any) => ({
    ...item,
    nome: item.translations?.[0]?.nome || labels.nameUnavailable,
    tipo_grupo: item.tipo_grupo_translated || item.tipo_grupo || labels.typeUnavailable,
    foto_capa: item.foto_capa ? assetUrl(item.foto_capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
  }))

  // Generate dynamic filters based on tipo_grupo
  const tipos = [labels.all, ...Array.from(new Set(grupos.map(grupo => grupo.tipo_grupo).filter(Boolean)))]

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton label={labels.back} />
      
      {/* Header Section */}
      <PageHeader title={labels.groups} description={labels.groupsDesc} />
      
      {/* Content Section */}
      <GruposClient 
        grupos={grupos}
        tipos={tipos}
        labels={labels}
      />
    </main>
  )
}
