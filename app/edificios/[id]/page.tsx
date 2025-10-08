import { BackButton } from "@/components/back-button"
import { fetchEdificioById, assetUrl } from "@/lib/directus"
import { notFound } from "next/navigation"

export default async function EdificioDetalhePage({ params }: { params: { id: string } }) {
  try {
    const edificio = await fetchEdificioById(params.id)

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
                    src={assetUrl(edificio.imagem, "fit=cover&width=1200&height=800&format=webp")}
                    alt={edificio.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance leading-tight">
                  {edificio.nome}
                </h1>
                {edificio.ano_construcao && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl text-primary font-medium">
                      {edificio.ano_construcao}
                    </span>
                    <span className="text-lg md:text-xl text-muted-foreground">Ano de construção</span>
                  </div>
                )}
              </div>

              {edificio.localizacao && (
                <div className="border-t border-border pt-8">
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Localização</h2>
                  <p className="text-lg md:text-xl text-muted-foreground">{edificio.localizacao}</p>
                </div>
              )}

              {edificio.descricao && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Sobre este edifício</h2>
                  <div className="text-lg md:text-xl text-foreground/80 leading-relaxed space-y-4 text-pretty">
                    {edificio.descricao.split("\n\n").map((paragrafo, index) => (
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
