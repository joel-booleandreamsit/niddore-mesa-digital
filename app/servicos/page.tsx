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
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      <BackButton label={labels.back} />
      
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            {labels.services || "Serviços"}
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.servicesDesc || "Os serviços oferecidos pela escola"}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <ServicosClient 
          servicos={servicos}
          statusOptions={statusOptions}
          labels={labels}
          lang={lang}
        />
      </div>
    </main>
  )
}
