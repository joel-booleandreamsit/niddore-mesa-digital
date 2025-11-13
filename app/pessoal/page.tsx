import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import PessoalList from "@/components/pessoal-list"
import { fetchAnosLectivosYears } from "@/lib/directus"
import { getLang, t } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function PessoalPage() {
  const lang = await getLang()
  const labels = t(lang)

  const years = await fetchAnosLectivosYears()
  let minYear = new Date().getFullYear() - 50
  let maxYear = new Date().getFullYear()
  if (Array.isArray(years) && years.length > 0) {
    const mins = years.map((y: any) => Number(y?.ano_inicio)).filter((n) => Number.isFinite(n))
    const maxs = years.map((y: any) => Number(y?.ano_fim)).filter((n) => Number.isFinite(n))
    if (mins.length) minYear = Math.min(...mins)
    if (maxs.length) maxYear = Math.max(...maxs)
  }

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton label={labels.back} />
      <PageHeader title={labels.people} description={labels.peopleDesc} />
      {/* Client list with search, filters, sort, pagination, and year slider */}
      <PessoalList labels={labels} yearBounds={{ minYear, maxYear }} />
    </main>
  )
}
