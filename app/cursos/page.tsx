import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"

const cursos = [
  { id: 1, nome: "Ciências e Tecnologias", ano: 1952 },
  { id: 2, nome: "Línguas e Humanidades", ano: 1952 },
  { id: 3, nome: "Artes Visuais", ano: 1965 },
  { id: 4, nome: "Ciências Socioeconómicas", ano: 1978 },
  { id: 5, nome: "Técnico de Informática", ano: 1995 },
  { id: 6, nome: "Técnico de Eletrónica", ano: 1998 },
  { id: 7, nome: "Técnico de Multimédia", ano: 2005 },
  { id: 8, nome: "Técnico de Design Gráfico", ano: 2008 },
  { id: 9, nome: "Técnico de Gestão", ano: 2010 },
  { id: 10, nome: "Técnico de Turismo", ano: 2015 },
]

export default function CursosPage() {
  return (
    <main className="min-h-screen bg-background">
      <BackButton />
      <PageHeader title="Cursos" description="Disciplinas lecionadas ao longo da história da escola" />

      <div className="max-w-6xl mx-auto px-8 md:px-16 pb-16">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="divide-y divide-border">
            {cursos.map((curso, index) => (
              <div
                key={curso.id}
                className="flex items-center justify-between p-8 md:p-10 hover:bg-muted/30 transition-colors touch-manipulation"
              >
                <div className="flex items-center gap-6 md:gap-8">
                  <span className="text-3xl md:text-4xl font-serif text-muted-foreground/40 w-16 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground text-balance">{curso.nome}</h3>
                </div>
                <span className="text-2xl md:text-3xl text-primary font-medium whitespace-nowrap ml-4">
                  {curso.ano}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
