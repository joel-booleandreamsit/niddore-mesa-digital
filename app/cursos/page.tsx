import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import CursosList, { type CursoItem } from "@/components/cursos-list"
import { fetchCursos } from "@/lib/directus"
import { getLang, t } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function CursosPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const lang = await getLang()
  const labels = t(lang)
  const edificioParam = searchParams?.edificio
  const edificioId = Array.isArray(edificioParam) ? edificioParam[0] : edificioParam

  const data = await fetchCursos(edificioId, lang)

  const courses: CursoItem[] = (data || []).map((item: any) => {
    const nome = item.translations?.[0]?.nome || labels.nameUnavailable
    const descricao = item.translations?.[0]?.descricao || null
    const lectiveYears = Array.isArray(item.anos_lectivos)
      ? item.anos_lectivos
          .map((row: any) => {
            const y = row?.Anos_Lectivos_id || row
            const start = Number(y?.ano_inicio)
            const end = Number(y?.ano_fim)
            if (!Number.isFinite(start) || !Number.isFinite(end)) return null
            return { start, end }
          })
          .filter(Boolean) as { start: number; end: number }[]
      : []
    return {
      id: item.id,
      nome,
      descricao,
      lectiveYears,
    }
  })

  return (
    <main className="min-h-screen bg-background">
      <BackButton />
      <PageHeader title={labels.courses} description={labels.coursesDesc} />

      <CursosList
        courses={courses}
        labels={{
          sort: labels.sort,
          sortByNameAZ: labels.sortByNameAZ,
          sortByNameZA: labels.sortByNameZA,
          sortByLectiveYearsMost: labels.sortByLectiveYearsMost,
          sortByLectiveYearsLeast: labels.sortByLectiveYearsLeast,
          yearRange: labels.yearRange,
          resetFilters: labels.resetFilters,
          lectiveYears: labels.lectiveYears,
          descriptionUnavailable: labels.descriptionUnavailable,
        }}
      />
    </main>
  )
}
