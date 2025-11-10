"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"

const categorias = ["Todos", "Laboratório", "Sala de Aula", "Biblioteca", "Desporto"]

const materiais = [
  {
    id: 1,
    nome: "Microscópio Zeiss",
    categoria: "Laboratório",
    descricao: "Microscópio ótico utilizado nas aulas de biologia desde 1960.",
    imagem: "/vintage-microscope.jpg",
  },
  {
    id: 2,
    nome: "Quadro Negro Original",
    categoria: "Sala de Aula",
    descricao: "Quadro negro de ardósia das primeiras salas de aula.",
    imagem: "/vintage-blackboard-classroom.jpg",
  },
  {
    id: 3,
    nome: "Globo Terrestre Antigo",
    categoria: "Sala de Aula",
    descricao: "Globo terrestre utilizado nas aulas de geografia.",
    imagem: "/antique-globe.jpg",
  },
  {
    id: 4,
    nome: "Livros Raros",
    categoria: "Biblioteca",
    descricao: "Coleção de livros raros do acervo original da biblioteca.",
    imagem: "/antique-books-collection.jpg",
  },
  {
    id: 5,
    nome: "Equipamento de Química",
    categoria: "Laboratório",
    descricao: "Vidraria e equipamentos de química das décadas de 60 e 70.",
    imagem: "/vintage-chemistry-equipment.jpg",
  },
  {
    id: 6,
    nome: "Troféus Desportivos",
    categoria: "Desporto",
    descricao: "Troféus conquistados em competições escolares.",
    imagem: "/sports-trophies.jpg",
  },
]

export default function MateriaisPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos")

  const materiaisFiltrados =
    categoriaAtiva === "Todos" ? materiais : materiais.filter((m) => m.categoria === categoriaAtiva)

  return (
    <main className="min-h-screen bg-background overflow-auto">
      <BackButton />
      <PageHeader title="Materiais" description="Materiais históricos utilizados na escola" />

      <div className="max-w-7xl mx-auto px-8 md:px-16 pb-16 space-y-12">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={`px-8 py-4 md:px-10 md:py-5 text-xl md:text-2xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
                categoriaAtiva === categoria
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10">
          {materiaisFiltrados.map((material) => (
            <div
              key={material.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={material.imagem || "/placeholder.svg"}
                  alt={material.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 space-y-3">
                <span className="inline-block px-4 py-2 text-sm md:text-base bg-secondary text-secondary-foreground rounded-full">
                  {material.categoria}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground text-balance">{material.nome}</h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed text-pretty">
                  {material.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
