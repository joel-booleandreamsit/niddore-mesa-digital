"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export type MaterialItem = {
  id: string | number
  nome: string
  breve_descricao?: string | null
  foto_url: string
  edificio?: string | number | null
}

export type MateriaisListProps = {
  materiais: MaterialItem[]
  labels: {
    viewDetails: string
    noMaterialsFound: string
    noMaterialsFoundForBuilding: string
  }
  edificios: Array<{ id: string | number; nome: string }>
  selectedEdificioId?: string | number | null
  categoryId?: string | number | null
}

export default function MateriaisList({ 
  materiais, 
  labels, 
  edificios, 
  selectedEdificioId,
  categoryId
}: MateriaisListProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | number | null>(selectedEdificioId ?? null)

  // Filter materials by building
  const materiaisFiltrados = useMemo(() => {
    if (!selectedBuilding) return materiais
    return materiais.filter(m => String(m.edificio) === String(selectedBuilding))
  }, [materiais, selectedBuilding])

  return (
    <div className="space-y-16">
      {/* Building Filter Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <Link
          href={categoryId ? `/materiais/categorias/${categoryId}` : `/materiais/categorias`}
          className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
            !selectedBuilding 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-card text-foreground border-border hover:border-primary"}`}
          onClick={() => setSelectedBuilding(null)}
        >
          Todos os Edifícios
        </Link>
        {edificios.map((edificio) => (
          <Link
            key={edificio.id}
            href={categoryId 
              ? `/materiais/categorias/${categoryId}?edificio=${edificio.id}` 
              : `/materiais/categorias?edificio=${edificio.id}`}
            className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
              String(selectedBuilding) === String(edificio.id)
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card text-foreground border-border hover:border-primary"}`}
            onClick={() => setSelectedBuilding(edificio.id)}
          >
            {edificio.nome}
          </Link>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-4 gap-16">
        {materiaisFiltrados.map((material) => (
          <Link
            key={material.id}
            href={`/materiais/${material.id}${selectedBuilding ? `?edificio=${selectedBuilding}` : ''}`}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={material.foto_url}
                alt={material.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-6">
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {material.nome}
              </h3>
              {material.breve_descricao && (
                <p className="text-2xl text-foreground/70 line-clamp-3">
                  {material.breve_descricao}
                </p>
              )}
              <div className="flex items-center gap-4 text-primary pt-4">
                <span className="text-2xl font-medium">{labels.viewDetails}</span>
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {materiaisFiltrados.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">
            {selectedBuilding 
              ? labels.noMaterialsFoundForBuilding
              : labels.noMaterialsFound}
          </p>
        </div>
      )}
    </div>
  )
}
