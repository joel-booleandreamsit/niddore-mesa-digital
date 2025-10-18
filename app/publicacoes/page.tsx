import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { fetchPublicacoes, assetUrl } from "@/lib/static-data"
import { t, getLang } from "@/lib/i18n"
import PublicacoesClient from "./publicacoes-client"

export const dynamic = 'force-static'

export default async function PublicacoesPage() {
  const lang = await getLang()
  const labels = t(lang)
  const data = await fetchPublicacoes(lang)

  // Transform data to match expected format
  const publicacoes = data.map((item: any) => ({
    ...item,
    nome: item.nome || 'Nome não disponível',
    descricao: item.translations?.[0]?.breve_descricao || 'Descrição não disponível',
    tipo: item.tipo_publicacao_translated || item.tipo_publicacao || 'Tipo não disponível',
    ano: item.ano_publicacao || new Date().getFullYear(),
    capa: item.capa ? assetUrl(item.capa, "fit=cover&width=400&height=600&format=webp") : '/placeholder.svg',
    autores: item.autores?.map((autor: any) => autor.Autores_id?.nome).filter(Boolean) || ['Autor não disponível']
  }))

  // Generate dynamic filters
  const tipos = [labels.all || "Todos", ...Array.from(new Set(publicacoes.map(pub => pub.tipo).filter(Boolean)))]

  return (
    <main className="min-h-screen bg-background">
      <BackButton label={labels.back || "Voltar"} />
      <PageHeader title={labels.publications || "Publicações"} description={labels.publicationsDesc || "Publicações da escola ao longo dos anos"} />
      
      <PublicacoesClient 
        publicacoes={publicacoes}
        tipos={tipos}
        labels={labels}
      />
    </main>
  )
}
