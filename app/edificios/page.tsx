import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import fetchEdificios, { assetUrl } from "@/lib/directus"
import Link from "next/link"
import Image from "next/image"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function EdificiosPage() {
  const lang = await getLang()
  const labels = t(lang)
  const locale = lang === 'en' ? 'en-US' : 'pt-PT'
  const data = await fetchEdificios(lang)

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const formatYear = (dateString?: string | null) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).getFullYear().toString()
    } catch {
      return '—'
    }
  }

  const formatDuration = (startStr?: string | null, endStr?: string | null) => {
    if (!startStr) return ''
    const start = new Date(startStr)
    const end = endStr ? new Date(endStr) : new Date()
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''

    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
      months -= 1
      const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate()
      days += daysInPrevMonth
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    const parts: string[] = []
    if (years > 0) parts.push(years + (lang === 'pt' ? (years === 1 ? ' ano' : ' anos') : (years === 1 ? ' year' : ' years')))
    if (months > 0) parts.push(months + (lang === 'pt' ? (months === 1 ? ' mês' : ' meses') : (months === 1 ? ' month' : ' months')))
    if (days > 0 && parts.length < 2) parts.push(days + (lang === 'pt' ? (days === 1 ? ' dia' : ' dias') : (days === 1 ? ' day' : ' days')))

    if (parts.length === 0) return lang === 'pt' ? '0 dias' : '0 days'
    if (parts.length === 1) return parts[0]
    if (parts.length === 2) return parts.join(lang === 'pt' ? ' e ' : ' and ')
    return parts[0] + ', ' + parts[1]
  }

  const items = (data || []).slice(0, 5).map((item: any) => {
    const nome = item.translations?.[0]?.nome || 'Nome não disponível'
    return {
      id: item.id,
      nome,
      foto: item.foto_capa || item.imagem || null,
      data_inicio: item.data_inicio || null,
      data_fim: item.data_fim || null,
    }
  })

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton />
      <PageHeader title={labels.buildings} description={labels.buildingsDesc} />

      <div className="mx-auto px-20 pb-8 mt-8 w-full">
        <div className="grid grid-cols-5 gap-10 items-start">
          {items.map((edificio: any) => (
            <Link
              key={edificio.id}
              href={`/edificios/${edificio.id}`}
              className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
            >
              <div className="overflow-hidden bg-muted h-[62vh]">
                <Image
                  src={assetUrl(edificio.foto, 'fit=cover&width=1200&height=1600&quality=85')}
                  alt={edificio.nome}
                  width={1200}
                  height={1600}
                  priority
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-10 space-y-10">
                <h3 className="font-serif text-6xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight line-clamp-2">
                  {edificio.nome}
                </h3>

                {/* Active range timeline */}
                <div className="space-y-6">
                  {/* Timeline: thin segments with centered dots and label above */}
                  <div className="flex items-center gap-4 relative">
                    {/* Duration label above center */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 text-xl italic leading-tight text-muted-foreground whitespace-nowrap">
                      ({formatDuration(edificio.data_inicio, edificio.data_fim)})
                    </div>

                    {/* Start year circle */}
                    <div className="w-24 h-24 rounded-full border-2 border-primary/90 bg-background flex items-center justify-center">
                      <span className="font-mono text-3xl text-foreground font-semibold">
                        {formatYear(edificio.data_inicio)}
                      </span>
                    </div>
                    {/* Left connector */}
                    <div className="flex-1 h-[2px] bg-border" />
                    {/* Center dots */}
                    <div className="flex items-center gap-2">
                      <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                      <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                      <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                    </div>
                    {/* Right connector */}
                    <div className="flex-1 h-[2px] bg-border" />
                    {/* End year circle (ellipsis if no end date) */}
                    <div className="w-24 h-24 rounded-full border-2 border-primary/90 bg-background flex items-center justify-center">
                      <span className="font-mono text-3xl text-foreground font-semibold">
                        {edificio.data_fim ? formatYear(edificio.data_fim) : '…'}
                      </span>
                    </div>
                  </div>
                </div>

                
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
