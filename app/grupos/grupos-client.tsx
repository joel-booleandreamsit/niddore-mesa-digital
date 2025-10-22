"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    <div className="w-full px-16 pb-24 space-y-24">
      {/* 4K Optimized Filters */}
      <div className="space-y-20">
        <div>
          <div className="mb-12">
            <h3 className="text-6xl text-muted-foreground font-medium">{labels.type || "Tipo"}</h3>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            {tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoAtivo(tipo)}
                className={`px-16 py-8 text-4xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
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

      {/* 4K Optimized Groups Horizontal List */}
      <div className="flex gap-32 overflow-x-auto pb-8">
        {gruposFiltrados.map((grupo) => (
          <Link
            key={grupo.id}
            href={`/grupos/${grupo.id}`}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-[56rem]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={grupo.foto_capa}
                alt={grupo.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-16 space-y-8">
              <div className="flex items-center justify-between gap-8">
                <span className="inline-block px-8 py-4 text-3xl bg-secondary text-secondary-foreground rounded-full font-medium">
                  {grupo.tipo_grupo}
                </span>
              </div>
              <h3 className="font-serif text-7xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {grupo.nome}
              </h3>
              <div className="flex items-center gap-4 text-primary pt-4">
                <span className="text-3xl font-medium">{labels.viewDetails || "Ver detalhes"}</span>
                <ArrowRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {gruposFiltrados.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhum grupo encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
