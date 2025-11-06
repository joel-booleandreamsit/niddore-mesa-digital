import { BackButton } from "@/components/back-button"
import { fetchEdificioById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"
import Link from "next/link"
import EdificioGallery from "@/components/edificio-gallery"
import { ScrollFade } from "@/components/scroll-fade"

export const dynamic = 'force-dynamic'

export default async function EdificioDetalhePage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const edificio = await fetchEdificioById(id, lang)

    // Use translations from Directus if available, otherwise fallback to original
    const translatedEdificio = {
      ...edificio,
      nome: edificio.translations?.[0]?.nome || labels.nameUnavailable,
      descricao: edificio.translations?.[0]?.descricao || labels.descriptionUnavailable,
    }

    // Extract gallery items with optional title/description (supports Directus M2M: fotos_galeria.directus_files_id)
    const galleryItems: { src: string; type?: 'image' | 'video'; title?: string | null; description?: string | null }[] = (() => {
      const g: any = (edificio as any).fotos_galeria
      if (!g) return []
      const arr = Array.isArray(g) ? g : []
      return arr
        .map((it: any) => {
          // Directus many-to-many often returns each item as { directus_files_id: string | { id, title, ... } }
          const df = it?.directus_files_id
          const dfId = typeof df === 'object' ? df?.id : df
          const candidateId = typeof it === 'string' ? it : (dfId || it?.file || it?.ficheiro || it?.foto || it?.imagem || it?.id)
          if (!candidateId || typeof candidateId !== 'string') return null
          const title = it?.titulo || it?.title || it?.nome || it?.name || (typeof df === 'object' ? (df as any)?.title : null) || null
          const description = it?.descricao || it?.description || (typeof df === 'object' ? (df as any)?.description : null) || null
          const mime = (typeof df === 'object' && (df?.type || (df as any)?.mime_type)) as string | undefined
          const filename = (typeof df === 'object' && (df as any)?.filename_download) as string | undefined
          const isVideo = (mime && mime.startsWith('video/')) || (filename && filename.toLowerCase().endsWith('.mp4'))
          const src = isVideo
            ? assetUrl(candidateId)
            : assetUrl(candidateId, "fit=cover&width=2000&height=1400&format=webp")
          return {
            src,
            type: isVideo ? 'video' : 'image',
            title,
            description,
          }
        })
        .filter(Boolean) as { src: string; type?: 'image' | 'video'; title?: string | null; description?: string | null }[]
    })()

    // Derive coordinates from localizacao (assume GeoJSON Point or {lat, lng})
    let lat: number | null = null
    let lon: number | null = null
    const loc: any = (edificio as any).localizacao
    if (loc) {
      if (loc?.type === 'Point' && Array.isArray(loc?.coordinates) && loc.coordinates.length >= 2) {
        lon = Number(loc.coordinates[0])
        lat = Number(loc.coordinates[1])
      } else if (typeof loc?.lat === 'number' && typeof loc?.lng === 'number') {
        lat = loc.lat
        lon = loc.lng
      } else if (typeof loc?.latitude === 'number' && typeof loc?.longitude === 'number') {
        lat = loc.latitude
        lon = loc.longitude
      }
    }
    const hasCoords = typeof lat === 'number' && typeof lon === 'number' && !Number.isNaN(lat) && !Number.isNaN(lon)
    const delta = 0.005
    const mapSrc = hasCoords
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${(lon as number)-delta},${(lat as number)-delta},${(lon as number)+delta},${(lat as number)+delta}&layer=mapnik&marker=${lat},${lon}`
      : null

    // Helpers for timeline
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

    return (
      <main className="min-h-screen bg-background overflow-auto">
        <BackButton />

        <div className="mx-auto px-8 py-8 w-full max-w-none space-y-12">
          <div className="space-y-3 pt-12">
            <h1 className="font-serif text-7xl text-foreground text-balance leading-tight text-center">
              {translatedEdificio.nome}
            </h1>            
            {(translatedEdificio as any).data_inicio && (
              <div className="mx-auto max-w-5xl pt-6">
                <div className="flex items-center gap-4 relative justify-center">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 text-xl italic leading-tight text-muted-foreground whitespace-nowrap">
                    ({formatDuration((translatedEdificio as any).data_inicio, (translatedEdificio as any).data_fim)})
                  </div>
                  <div className="w-24 h-24 rounded-full border-2 border-primary/90 bg-background flex items-center justify-center">
                    <span className="font-mono text-3xl text-foreground font-semibold">
                      {formatYear((translatedEdificio as any).data_inicio)}
                    </span>
                  </div>
                  <div className="flex-1 h-[2px] bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                    <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                    <span className="block w-2.5 h-2.5 bg-foreground rounded-full" />
                  </div>
                  <div className="flex-1 h-[2px] bg-border" />
                  <div className="w-24 h-24 rounded-full border-2 border-primary/90 bg-background flex items-center justify-center">
                    <span className="font-mono text-3xl text-foreground font-semibold">
                      {(translatedEdificio as any).data_fim ? formatYear((translatedEdificio as any).data_fim) : '…'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Top Menu Bar */}
          <div className="w-full">
            <nav className="grid grid-cols-5 gap-4 w-full">
              <Link href="/pessoal" className="w-full px-4 py-6 text-3xl rounded-lg border-2 bg-card text-foreground border-border hover:border-primary transition-all text-center">{labels.people || 'Pessoal'}</Link>
              <Link href="/alunos" className="w-full px-4 py-6 text-3xl rounded-lg border-2 bg-card text-foreground border-border hover:border-primary transition-all text-center">{labels.students || 'Alunos'}</Link>
              <Link href={`/cursos?edificio=${id}`} className="w-full px-4 py-6 text-3xl rounded-lg border-2 bg-card text-foreground border-border hover:border-primary transition-all text-center">{labels.courses || 'Cursos'}</Link>
              <Link href={`/materiais/categorias?edificio=${id}&tipo=Material`} className="w-full px-4 py-6 text-3xl rounded-lg border-2 bg-card text-foreground border-border hover:border-primary transition-all text-center">{labels.materials || 'Materiais'}</Link>
              <Link href={`/materiais/categorias?edificio=${id}&tipo=Trabalho`} className="w-full px-4 py-6 text-3xl rounded-lg border-2 bg-card text-foreground border-border hover:border-primary transition-all text-center">{labels.works || 'Trabalhos'}</Link>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left column: Photo + Location widget */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-10">
                <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={assetUrl((translatedEdificio as any).imagem || (translatedEdificio as any).foto_capa, "fit=cover&width=1600&height=1200&format=webp")}
                    alt={translatedEdificio.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Localização widget */}
                {hasCoords && mapSrc && (
                  <div className="space-y-4">
                    <h2 className="font-serif text-4xl text-foreground">{labels.location}</h2>
                    <div className="rounded-xl overflow-hidden border border-border bg-card mt-11">
                      <div className="w-full h-[30rem]">
                        <iframe
                          title={labels.openMap}
                          src={mapSrc}
                          className="w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Content */}
            <div className="lg:col-span-3 space-y-12">

              {/* Description */}
              {translatedEdificio.descricao && (
                <div className="prose prose-3xl max-w-none">
                  
                  <ScrollFade
                    html={translatedEdificio.descricao}
                    containerClassName="relative prose prose-3xl max-w-none"
                    contentClassName="h-[62rem] overflow-y-auto pr-4 text-4xl text-foreground/80 leading-relaxed prose prose-3xl max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-8 [&_ul]:pl-12 [&_ol]:pl-12 [&_p]:mb-8 [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl"
                  />
                </div>
              )}

              {/* Gallery aligned with Location (nudged down) */}
              {galleryItems.length > 0 && (
                <div className="border-t border-border pt-13 mt-12">                  
                  <EdificioGallery items={galleryItems} labels={{ gallery: labels.gallery, photo: labels.photo, descriptionUnavailable: labels.descriptionUnavailable }} />
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
