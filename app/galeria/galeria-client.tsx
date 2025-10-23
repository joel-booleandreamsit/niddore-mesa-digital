"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Categoria {
  id: number
  nome: string
  descricao: string
}

interface Subcategoria {
  id: number
  nome: string
  descricao: string
  categoria_principal: number
  categoria_principal_nome: string
}

interface Foto {
  id: number
  breve_descricao: string
  descricao: string
  categoria: number
  categoria_nome: string
  foto_url: string
}

interface GaleriaClientProps {
  categorias: Categoria[]
  subcategorias: Subcategoria[]
  fotos: Foto[]
  labels: any
}

export default function GaleriaClient({ categorias, subcategorias, fotos, labels }: GaleriaClientProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(labels.all || "Todos")
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState<string>(labels.all || "Todos")

  // Get subcategories for the active category
  const subcategoriasFiltradas = categoriaAtiva === (labels.all || "Todos") 
    ? subcategorias 
    : subcategorias.filter(sub => sub.categoria_principal_nome === categoriaAtiva)

  // Filter photos based on active filters
  const fotosFiltradas = fotos.filter(foto => {
    if (categoriaAtiva !== (labels.all || "Todos") && foto.categoria_nome !== categoriaAtiva) {
      return false
    }
    if (subcategoriaAtiva !== (labels.all || "Todos") && foto.categoria_nome !== subcategoriaAtiva) {
      return false
    }
    return true
  })

  // Handle category filter change
  const handleCategoriaChange = (categoria: string) => {
    setCategoriaAtiva(categoria)
    setSubcategoriaAtiva(labels.all || "Todos") // Reset subcategory filter
  }

  return (
    <div className="px-20 pb-24 space-y-20 mt-16">
      {/* 4K Optimized Filters */}
      <div className="space-y-16">
        {/* Category Filter */}
        <div>
          <h3 className="text-4xl text-muted-foreground font-medium mb-8">{labels.category || "Categoria"}</h3>
          <div className="flex flex-wrap gap-6 items-center">
            <button
              onClick={() => handleCategoriaChange(labels.all || "Todos")}
              className={`px-12 py-6 text-3xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
                categoriaAtiva === (labels.all || "Todos")
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary"
              }`}
            >
              {labels.all || "Todos"}
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => handleCategoriaChange(categoria.nome)}
                className={`px-12 py-6 text-3xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
                  categoriaAtiva === categoria.nome
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                }`}
              >
                {categoria.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        {subcategoriasFiltradas.length > 0 && (
          <div>
            <h3 className="text-4xl text-muted-foreground font-medium mb-8">{labels.subcategory || "Subcategoria"}</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <button
                onClick={() => setSubcategoriaAtiva(labels.all || "Todos")}
                className={`px-12 py-6 text-3xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
                  subcategoriaAtiva === (labels.all || "Todos")
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                }`}
              >
                {labels.all || "Todos"}
              </button>
              {subcategoriasFiltradas.map((subcategoria) => (
                <button
                  key={subcategoria.id}
                  onClick={() => setSubcategoriaAtiva(subcategoria.nome)}
                  className={`px-12 py-6 text-3xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
                    subcategoriaAtiva === subcategoria.nome
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {subcategoria.nome}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4K Optimized Photos Grid */}
      <div className="mt-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {fotosFiltradas.map((foto) => (
            <Link
              key={foto.id}
              href={`/galeria/${foto.id}`}
              className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={foto.foto_url}
                  alt={foto.breve_descricao}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-2xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                  {foto.breve_descricao}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {foto.categoria_nome}
                </p>
                <div className="flex items-center gap-3 text-primary pt-2">
                  <span className="text-lg font-medium">{labels.viewDetails || "Ver detalhes"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {fotosFiltradas.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhuma foto encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
