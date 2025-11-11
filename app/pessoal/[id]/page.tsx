import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { assetUrl, fetchPessoalById } from "@/lib/directus"
import { getLang, t } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function PessoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lang = await getLang()
  const labels = t(lang)

  const item = await fetchPessoalById(id, lang)

  const fotoUrl = assetUrl(item?.foto)
  // Aggregate info
  const pal = Array.isArray(item?.anos_lectivos) ? item.anos_lectivos : []
  const lectiveYearsCount = pal.length
  const disciplinasCount = item?.docente
    ? pal.reduce((acc: number, r: any) => acc + ((r?.disciplinas || []).length || 0), 0)
    : 0

  // Group PAL by year, map relations with translated names
  const years = pal
    .map((r: any) => {
      const y = r?.Anos_Lectivos_id
      const yearStart = Number(y?.ano_inicio)
      const yearEnd = Number(y?.ano_fim)
      return {
        id: r.id,
        start: Number.isFinite(yearStart) ? yearStart : null,
        end: Number.isFinite(yearEnd) ? yearEnd : null,
        funcao: r?.funcao?.translations?.[0]?.nome || null,
        categoria: r?.categoria?.translations?.[0]?.nome || null,
        grupo: r?.grupo?.translations?.[0]?.nome || null,
        curso: r?.curso?.translations?.[0]?.nome || null,
        disciplinas: Array.isArray(r?.disciplinas) ? r.disciplinas.map((d: any) => d?.Disciplinas_id?.translations?.[0]?.nome).filter(Boolean) : [],
      }
    })
    .filter((y: any) => y.start && y.end)
    .sort((a: any, b: any) => a.start - b.start)

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton label={labels.back} />
      <PageHeader title={item?.nome || labels.nameUnavailable} description={`${labels.processNumber}: ${item?.numero_processo || '-'}`} />

      <div className="max-w-[3000px] mx-auto px-10 pb-24">
        {/* Header card */}
        <div className="flex gap-10 items-center mb-12">
          <img src={fotoUrl} alt={item?.nome} className="w-36 h-36 rounded-full object-cover bg-muted border border-border" />
          <div className="text-3xl text-muted-foreground">
            <div><span className="font-medium text-foreground mr-3">{labels.teacher}:</span>{item?.docente ? labels.yes : labels.no}</div>
            <div><span className="font-medium text-foreground mr-3">{labels.lectiveYearsWorked}:</span>{lectiveYearsCount}</div>
            {item?.docente && (
              <div><span className="font-medium text-foreground mr-3">{labels.taughtDisciplinesCount}:</span>{disciplinasCount}</div>
            )}
          </div>
        </div>

        {/* Years list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border">
            {years.map((y: any, idx: number) => (
              <details key={y.id || idx} className="p-12">
                <summary className="cursor-pointer text-4xl text-foreground">{y.start}/{y.end}</summary>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-3xl">
                  <div><span className="text-muted-foreground mr-3">Função:</span>{y.funcao || '—'}</div>
                  <div><span className="text-muted-foreground mr-3">Categoria:</span>{y.categoria || '—'}</div>
                  <div><span className="text-muted-foreground mr-3">Grupo:</span>{y.grupo || '—'}</div>
                  <div><span className="text-muted-foreground mr-3">Curso:</span>{y.curso || '—'}</div>
                  {y.disciplinas && y.disciplinas.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground mr-3">Disciplinas:</span>
                      <span>{y.disciplinas.join(', ')}</span>
                    </div>
                  )}
                </div>
              </details>
            ))}
            {years.length === 0 && (
              <div className="p-12 text-3xl text-muted-foreground">—</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
