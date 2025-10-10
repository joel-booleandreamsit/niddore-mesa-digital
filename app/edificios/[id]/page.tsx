import { BackButton } from "@/components/back-button"
import { fetchEdificioById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"
import { t, getLang } from "@/lib/i18n"

export default async function EdificioDetalhePage({ params }: { params: { id: string } }) {
  try {
    const lang = await getLang()
    const labels = t(lang)
    const edificio = await fetchEdificioById(params.id, lang)

        // Use translations from Directus if available, otherwise fallback to original
        const translatedEdificio = {
          ...edificio,
          nome: edificio.translations?.[0]?.nome || 'Nome não disponível',
          descricao: edificio.translations?.[0]?.descricao || 'Descrição não disponível',
        }

    return (
      <main className="min-h-screen bg-background">
        <BackButton />

        <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="aspect-[3/2] rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={assetUrl(translatedEdificio.imagem, "fit=cover&width=1200&height=800&format=webp")}
                    alt={translatedEdificio.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance leading-tight">
                  {translatedEdificio.nome}
                </h1>
                {translatedEdificio.ano_construcao && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl text-primary font-medium">
                      {translatedEdificio.ano_construcao}
                    </span>
                    <span className="text-lg md:text-xl text-muted-foreground">{labels.yearBuilt}</span>
                  </div>
                )}
              </div>

              {translatedEdificio.localizacao && (
                <div className="border-t border-border pt-8">
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">{labels.location}</h2>
                  <p className="text-lg md:text-xl text-muted-foreground">{translatedEdificio.localizacao}</p>
                </div>
              )}

              {translatedEdificio.descricao && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{labels.aboutBuilding}</h2>
                  <div className="text-lg md:text-xl text-foreground/80 leading-relaxed space-y-4 text-pretty">
                    {translatedEdificio.descricao.split("\n\n").map((paragrafo, index) => (
                      <p key={index}>{paragrafo}</p>
                    ))}
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
