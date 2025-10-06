"use client"

import { useState } from "react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { ArrowRight } from "lucide-react"

const anos = ["Todos", "2020-2025", "2015-2019", "2010-2014", "2005-2009", "Antes de 2005"]
const tipos = ["Todos", "Revista", "Jornal", "Anuário", "Catálogo"]

const publicacoes = [
  {
    id: 1,
    nome: "Revista Escolar 2024",
    autores: ["Comissão Editorial"],
    dataPublicacao: "2024-06-15",
    tipo: "Revista",
    descricao: "Edição anual com trabalhos dos alunos e atividades do ano letivo.",
    capa: "/school-magazine-cover.jpg",
  },
  {
    id: 2,
    nome: "Jornal Domingos Rebelo - Ed. 45",
    autores: ["Clube de Jornalismo"],
    dataPublicacao: "2024-03-20",
    tipo: "Jornal",
    descricao: "Jornal trimestral com notícias e reportagens da comunidade escolar.",
    capa: "/school-newspaper.jpg",
  },
  {
    id: 3,
    nome: "Anuário 2023",
    autores: ["Direção da Escola"],
    dataPublicacao: "2023-07-10",
    tipo: "Anuário",
    descricao: "Registo fotográfico e memórias do ano letivo 2022/2023.",
    capa: "/school-yearbook-cover.jpg",
  },
  {
    id: 4,
    nome: "Catálogo de Exposição - Arte Açoriana",
    autores: ["Departamento de Artes"],
    dataPublicacao: "2023-05-12",
    tipo: "Catálogo",
    descricao: "Catálogo da exposição de trabalhos de artes visuais.",
    capa: "/art-exhibition-catalog.jpg",
  },
  {
    id: 5,
    nome: "Revista Científica 2022",
    autores: ["Clube de Ciência"],
    dataPublicacao: "2022-11-30",
    tipo: "Revista",
    descricao: "Publicação com artigos científicos dos alunos.",
    capa: "/science-magazine-cover.jpg",
  },
  {
    id: 6,
    nome: "História da Escola - 70 Anos",
    autores: ["Prof. João Silva", "Prof. Maria Santos"],
    dataPublicacao: "2022-09-15",
    tipo: "Catálogo",
    descricao: "Publicação comemorativa dos 70 anos da escola.",
    capa: "/historical-book-cover.png",
  },
]

export default function PublicacoesPage() {
  const [anoAtivo, setAnoAtivo] = useState("Todos")
  const [tipoAtivo, setTipoAtivo] = useState("Todos")

  const publicacoesFiltradas = publicacoes.filter((pub) => {
    const anoPublicacao = new Date(pub.dataPublicacao).getFullYear()
    let passaAno = true
    let passaTipo = true

    if (anoAtivo !== "Todos") {
      if (anoAtivo === "2020-2025") passaAno = anoPublicacao >= 2020
      else if (anoAtivo === "2015-2019") passaAno = anoPublicacao >= 2015 && anoPublicacao < 2020
      else if (anoAtivo === "2010-2014") passaAno = anoPublicacao >= 2010 && anoPublicacao < 2015
      else if (anoAtivo === "2005-2009") passaAno = anoPublicacao >= 2005 && anoPublicacao < 2010
      else if (anoAtivo === "Antes de 2005") passaAno = anoPublicacao < 2005
    }

    if (tipoAtivo !== "Todos") {
      passaTipo = pub.tipo === tipoAtivo
    }

    return passaAno && passaTipo
  })

  return (
    <main className="min-h-screen bg-background">
      <BackButton />
      <PageHeader title="Publicações" description="Publicações da escola ao longo dos anos" />

      <div className="max-w-7xl mx-auto px-8 md:px-16 pb-16 space-y-12">
        {/* Filters */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl text-muted-foreground mb-4">Período</h3>
            <div className="flex flex-wrap gap-3">
              {anos.map((ano) => (
                <button
                  key={ano}
                  onClick={() => setAnoAtivo(ano)}
                  className={`px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
                    anoAtivo === ano
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {ano}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl text-muted-foreground mb-4">Tipo</h3>
            <div className="flex flex-wrap gap-3">
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoAtivo(tipo)}
                  className={`px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
                    tipoAtivo === tipo
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {publicacoesFiltradas.map((pub) => (
            <Link
              key={pub.id}
              href={`/publicacoes/${pub.id}`}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-98"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={pub.capa || "/placeholder.svg"}
                  alt={pub.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-block px-4 py-2 text-sm md:text-base bg-secondary text-secondary-foreground rounded-full">
                    {pub.tipo}
                  </span>
                  <span className="text-base md:text-lg text-muted-foreground">
                    {new Date(pub.dataPublicacao).getFullYear()}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground text-balance group-hover:text-primary transition-colors">
                  {pub.nome}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">{pub.autores.join(", ")}</p>
                <div className="flex items-center gap-2 text-primary pt-2">
                  <span className="text-base md:text-lg">Ver detalhes</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
