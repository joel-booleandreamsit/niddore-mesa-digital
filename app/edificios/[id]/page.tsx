import { BackButton } from "@/components/back-button"
import { fetchEdificioById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-dynamic'

export default async function EdificioDetalhePage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const lang = await getLang()
    const labels = t(lang)
    const edificio = await fetchEdificioById(id, lang)

    console.log(edificio)
    // Use translations from Directus if available, otherwise fallback to original
    const translatedEdificio = {
      ...edificio,
      nome: edificio.translations?.[0]?.nome || 'Nome não disponível',
      descricao: edificio.translations?.[0]?.descricao || 'Descrição não disponível',
    }

    // Extract gallery photos (supports multiple common Directus relation shapes)
    const galleryUrls: string[] = (() => {
      const g: any = (edificio as any).fotos_galeria
      if (!g) return []
      const arr = Array.isArray(g) ? g : []
      return arr
        .map((it: any) => {
          const fileId = typeof it === 'string'
            ? it
            : (it?.directus_files_id || it?.file || it?.ficheiro || it?.foto || it?.imagem || it?.id)
          return fileId ? assetUrl(fileId, "fit=cover&width=2000&height=1400&format=webp") : null
        })
        .filter(Boolean) as string[]
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

    return (
      <main className="min-h-screen bg-background">
        <BackButton />

        <div className="mx-auto px-8 md:px-16 py-16 md:py-24 w-full max-w-[180rem]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={assetUrl((translatedEdificio as any).imagem || (translatedEdificio as any).foto_capa, "fit=cover&width=1600&height=1200&format=webp")}
                    alt={translatedEdificio.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground text-balance leading-tight">
                  {translatedEdificio.nome}
                </h1>
                {(translatedEdificio as any).ano_construcao && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl text-primary font-medium">
                      {(translatedEdificio as any).ano_construcao}
                    </span>
                    <span className="text-lg md:text-xl text-muted-foreground">{labels.yearBuilt}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {translatedEdificio.descricao && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{labels.aboutBuilding}</h2>
                  <div className="text-xl md:text-2xl text-foreground/80 leading-relaxed space-y-6 text-pretty">
                    {translatedEdificio.descricao.split("\n\n").map((paragrafo: string, index: number) => (
                      <p key={index}>{paragrafo}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {galleryUrls.length > 0 && (
                <div className="border-t border-border pt-10">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{labels.gallery}</h2>
                  <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
                    {galleryUrls.map((src, idx) => (
                      <div key={idx} className="min-w-[40rem] md:min-w-[48rem] xl:min-w-[56rem] 2xl:min-w-[64rem] aspect-[4/3] rounded-xl overflow-hidden border border-border snap-start">
                        <img src={src} alt={`${translatedEdificio.nome} ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {hasCoords && mapSrc && (
                <div className="border-t border-border pt-10">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{labels.location}</h2>
                  <div className="w-full h-[28rem] md:h-[34rem] xl:h-[40rem] rounded-xl overflow-hidden border border-border">
                    <iframe
                      title="OpenStreetMap"
                      src={mapSrc}
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      OpenStreetMap
                    </a>
                  </div>
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
