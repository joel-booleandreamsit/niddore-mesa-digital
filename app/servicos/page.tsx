import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { fetchServicos, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import ServicosClient from "./servicos-client"

export const dynamic = 'force-dynamic'

export default async function ServicosPage() {
  const lang = await getLang()
  const labels = t(lang)
  const data = await fetchServicos(lang)

  // Transform data to match expected format
  const servicos = data.map((item: any) => ({
    ...item,
    nome: item.translations?.[0]?.nome || labels.nameUnavailable,
    data_inicio: item.data_inicio || null,
    data_fim: item.data_fim || null,
    foto_capa: item.foto_capa ? assetUrl(item.foto_capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    isActive: !item.data_fim, // Service is active if no end date
  }))

  // Generate dynamic filters based on status
  const statusOptions = [labels.all, labels.active, labels.inactive]

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton label={labels.back} />
      {/* Header Section */}
      <PageHeader title={labels.services} description={labels.servicesDesc} />
      <ServicosClient 
        servicos={servicos}
        statusOptions={statusOptions}
        labels={labels}
        lang={lang}
      />
    </main>
  )
}

