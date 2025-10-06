import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"

const edificios = [
  {
    id: 1,
    nome: "Edifício Principal",
    localizacao: "Ponta Delgada",
    anoConstrucao: 1952,
    descricao: "O edifício principal da escola, construído em estilo modernista.",
    imagem: "/historic-school-building-facade.jpg",
  },
  {
    id: 2,
    nome: "Pavilhão Desportivo",
    localizacao: "Campus Norte",
    anoConstrucao: 1978,
    descricao: "Pavilhão dedicado às atividades desportivas e educação física.",
    imagem: "/sports-pavilion-building.jpg",
  },
  {
    id: 3,
    nome: "Biblioteca",
    localizacao: "Ala Oeste",
    anoConstrucao: 1985,
    descricao: "Espaço dedicado ao estudo e pesquisa com vasto acervo bibliográfico.",
    imagem: "/library-interior-with-books.jpg",
  },
  {
    id: 4,
    nome: "Laboratórios",
    localizacao: "Ala Este",
    anoConstrucao: 1995,
    descricao: "Laboratórios modernos para ciências experimentais.",
    imagem: "/science-laboratory.png",
  },
]

export default function EdificiosPage() {
  return (
    <main className="min-h-screen bg-background">
      <BackButton />
      <PageHeader title="Edifícios" description="As instalações da escola ao longo da sua história" />

      <div className="max-w-7xl mx-auto px-8 md:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {edificios.map((edificio) => (
            <div
              key={edificio.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={edificio.imagem || "/placeholder.svg"}
                  alt={edificio.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 md:p-10 space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground text-balance">{edificio.nome}</h3>
                  <span className="text-xl md:text-2xl text-primary font-medium whitespace-nowrap">
                    {edificio.anoConstrucao}
                  </span>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground">{edificio.localizacao}</p>
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-pretty">
                  {edificio.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
