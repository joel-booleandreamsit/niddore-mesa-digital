import { BackButton } from "@/components/back-button"
import { Calendar, Users } from "lucide-react"

const publicacoes = [
  {
    id: 1,
    nome: "Revista Escolar 2024",
    autores: ["Comissão Editorial"],
    dataPublicacao: "2024-06-15",
    tipo: "Revista",
    descricao: "Edição anual com trabalhos dos alunos e atividades do ano letivo.",
    capa: "/school-magazine-cover.jpg",
    conteudo: `Esta edição da Revista Escolar celebra mais um ano letivo repleto de conquistas e aprendizagens. 

Ao longo destas páginas, encontrará uma seleção dos melhores trabalhos produzidos pelos nossos alunos nas diversas disciplinas, desde ensaios literários a projetos científicos, passando por criações artísticas que demonstram o talento e dedicação da nossa comunidade escolar.

Destacamos também as principais atividades realizadas ao longo do ano: visitas de estudo, intercâmbios culturais, competições desportivas e eventos que enriqueceram a experiência educativa de todos os participantes.

Esta publicação é um testemunho do compromisso da Escola Secundária Domingos Rebelo com a excelência educativa e o desenvolvimento integral dos seus alunos.`,
    paginas: 120,
    edicao: "45ª Edição",
  },
  {
    id: 2,
    nome: "Jornal Domingos Rebelo - Ed. 45",
    autores: ["Clube de Jornalismo"],
    dataPublicacao: "2024-03-20",
    tipo: "Jornal",
    descricao: "Jornal trimestral com notícias e reportagens da comunidade escolar.",
    capa: "/school-newspaper.jpg",
    conteudo: `O Jornal Domingos Rebelo é a voz da nossa comunidade escolar, trazendo notícias, reportagens e opiniões sobre os acontecimentos mais relevantes do trimestre.

Nesta edição, destacamos a participação dos nossos alunos em competições nacionais, entrevistas com professores sobre metodologias inovadoras, e uma reportagem especial sobre a história do edifício da escola.

O Clube de Jornalismo continua a promover o pensamento crítico e a literacia mediática entre os estudantes, proporcionando uma plataforma para as suas vozes e perspetivas.`,
    paginas: 24,
    edicao: "45ª Edição",
  },
  {
    id: 3,
    nome: "Anuário 2023",
    autores: ["Direção da Escola"],
    dataPublicacao: "2023-07-10",
    tipo: "Anuário",
    descricao: "Registo fotográfico e memórias do ano letivo 2022/2023.",
    capa: "/school-yearbook-cover.jpg",
    conteudo: `O Anuário 2023 é uma celebração visual do ano letivo 2022/2023, capturando os momentos mais memoráveis e significativos da vida escolar.

Através de centenas de fotografias, este anuário documenta eventos, atividades, conquistas e os rostos que fazem da nossa escola uma comunidade vibrante e acolhedora.

Desde o primeiro dia de aulas até à cerimónia de finalistas, cada página conta uma história de crescimento, amizade e aprendizagem que ficará para sempre na memória de todos os que fazem parte da família Domingos Rebelo.`,
    paginas: 200,
    edicao: "Ano Letivo 2022/2023",
  },
  {
    id: 4,
    nome: "Catálogo de Exposição - Arte Açoriana",
    autores: ["Departamento de Artes"],
    dataPublicacao: "2023-05-12",
    tipo: "Catálogo",
    descricao: "Catálogo da exposição de trabalhos de artes visuais.",
    capa: "/art-exhibition-catalog.jpg",
    conteudo: `Este catálogo acompanha a exposição "Arte Açoriana", que apresenta uma seleção de trabalhos produzidos pelos alunos do curso de Artes Visuais, inspirados na rica herança cultural dos Açores.

As obras exploram temas como a paisagem vulcânica, as tradições locais, a arquitetura típica e a relação do povo açoriano com o mar, utilizando diversas técnicas e suportes artísticos.

A exposição é uma homenagem ao pintor Domingos Rebelo e ao seu legado artístico, demonstrando como as novas gerações continuam a encontrar inspiração nas suas raízes culturais.`,
    paginas: 48,
    edicao: "Maio 2023",
  },
  {
    id: 5,
    nome: "Revista Científica 2022",
    autores: ["Clube de Ciência"],
    dataPublicacao: "2022-11-30",
    tipo: "Revista",
    descricao: "Publicação com artigos científicos dos alunos.",
    capa: "/science-magazine-cover.jpg",
    conteudo: `A Revista Científica 2022 reúne artigos de investigação e divulgação científica produzidos pelos membros do Clube de Ciência.

Os trabalhos abrangem diversas áreas do conhecimento, desde a biologia marinha dos Açores até experiências de física e química, passando por projetos de sustentabilidade ambiental e inovação tecnológica.

Esta publicação reflete o compromisso da escola com a promoção da literacia científica e o desenvolvimento do espírito crítico e investigativo nos jovens estudantes.`,
    paginas: 80,
    edicao: "12ª Edição",
  },
  {
    id: 6,
    nome: "História da Escola - 70 Anos",
    autores: ["Prof. João Silva", "Prof. Maria Santos"],
    dataPublicacao: "2022-09-15",
    tipo: "Catálogo",
    descricao: "Publicação comemorativa dos 70 anos da escola.",
    capa: "/historical-book-cover.png",
    conteudo: `Esta publicação comemorativa celebra os 70 anos da Escola Secundária Domingos Rebelo, desde a sua fundação em 1952 até aos dias de hoje.

Através de documentos históricos, fotografias de arquivo e testemunhos de antigos alunos e professores, traçamos a evolução da instituição e o seu papel fundamental na educação de gerações de açorianos.

A obra documenta as transformações do edifício, a evolução dos cursos oferecidos, os momentos marcantes e as personalidades que contribuíram para fazer desta escola uma referência educativa nos Açores.`,
    paginas: 250,
    edicao: "Edição Comemorativa",
  },
]

export default function PublicacaoDetalhePage({ params }: { params: { id: string } }) {
  const publicacao = publicacoes.find((p) => p.id === Number.parseInt(params.id))

  if (!publicacao) {
    return <div>Publicação não encontrada</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <BackButton />

      <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16">
          {/* Cover Image */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={publicacao.capa || "/placeholder.svg"}
                  alt={publicacao.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-5 py-2 text-lg md:text-xl bg-secondary text-secondary-foreground rounded-full">
                {publicacao.tipo}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance leading-tight">
                {publicacao.nome}
              </h1>
            </div>

            <div className="flex flex-wrap gap-6 text-lg md:text-xl text-muted-foreground">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <span>{publicacao.autores.join(", ")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                <span>
                  {new Date(publicacao.dataPublicacao).toLocaleDateString("pt-PT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-lg text-muted-foreground mb-2">Páginas</p>
                  <p className="text-2xl md:text-3xl font-serif text-foreground">{publicacao.paginas}</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground mb-2">Edição</p>
                  <p className="text-2xl md:text-3xl font-serif text-foreground">{publicacao.edicao}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Sobre esta publicação</h2>
              <div className="text-lg md:text-xl text-foreground/80 leading-relaxed space-y-4 text-pretty">
                {publicacao.conteudo.split("\n\n").map((paragrafo, index) => (
                  <p key={index}>{paragrafo}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
