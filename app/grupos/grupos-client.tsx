"use client"

import { useState } from "react"
import Link from "next/link"
import { FilterButtons } from "@/components/filters"
import { HorizontalList } from "@/components/horizontal-list"

interface Grupo {
  id: number
  nome: string
  tipo_grupo: string
  foto_capa: string
}

interface GruposClientProps {
  grupos: Grupo[]
  tipos: string[]
  labels: any
}

export default function GruposClient({ grupos, tipos, labels }: GruposClientProps) {
  const [tipoAtivo, setTipoAtivo] = useState(labels.all || "Todos")

  const gruposFiltrados = grupos.filter((grupo) => {
    if (tipoAtivo !== (labels.all || "Todos")) {
      return grupo.tipo_grupo === tipoAtivo
    }
    return true
  })


  return (
    <div className="w-full h-full px-20 pb-24 space-y-20 mt-16">
      {/* Filters */}
      <div className="space-y-16">
        <div>
          <div className="mb-6">
            <h3 className="text-4xl text-muted-foreground">{labels.type || "Tipo"}</h3>
          </div>
          <FilterButtons options={tipos} active={tipoAtivo} onChange={setTipoAtivo} />
        </div>
      </div>

      {/* Groups Horizontal List */}
      <HorizontalList>
        {gruposFiltrados.map((grupo) => (
          <Link
            key={grupo.id}
            href={`/grupos/${grupo.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-[40rem]"
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={grupo.foto_capa}
                alt={grupo.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-4 pb-16">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-block px-4 py-2 text-xl bg-secondary text-secondary-foreground rounded-full">
                  {grupo.tipo_grupo}
                </span>
              </div>
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors">
                {grupo.nome}
              </h3>
              
            </div>
          </Link>
        ))}
      </HorizontalList>

      {gruposFiltrados.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhum grupo encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
