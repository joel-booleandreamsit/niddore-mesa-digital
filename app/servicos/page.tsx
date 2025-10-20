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
    nome: item.translations?.[0]?.nome || 'Nome não disponível',
    descricao: item.translations?.[0]?.descricao || 'Descrição não disponível',
    data_inicio: item.data_inicio || null,
    data_fim: item.data_fim || null,
    foto_capa: item.foto_capa ? assetUrl(item.foto_capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    fotos_galeria: item.fotos_galeria ? item.fotos_galeria.map((foto: any) => foto.directus_files_id).filter(Boolean) : [],
    isActive: !item.data_fim, // Service is active if no end date
  }))

  // Generate dynamic filters based on status
  const statusOptions = [labels.all || "Todos", labels.active || "Ativo", "Inativo"]

  return (
    <main className="min-h-screen bg-background">
      <BackButton label={labels.back || "Voltar"} />
      
      {/* 4K Optimized Header */}
      <div className="px-16 py-12">
        <div className="max-w-none mx-auto">
          <h1 className="font-serif text-8xl text-foreground text-balance mb-6">{labels.services || "Serviços"}</h1>
          <p className="text-4xl text-muted-foreground max-w-6xl leading-relaxed text-balance">
            {labels.servicesDesc || "Os serviços oferecidos pela escola"}
          </p>
        </div>
      </div>
      
      <ServicosClient 
        servicos={servicos}
        statusOptions={statusOptions}
        labels={labels}
      />
    </main>
  )
}
