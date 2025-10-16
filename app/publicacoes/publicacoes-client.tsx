"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpDown } from "lucide-react"

interface Publicacao {
  id: number
  nome: string
  descricao: string
  tipo: string
  ano: number
  capa: string
  autores: string[]
}

interface PublicacoesClientProps {
  publicacoes: Publicacao[]
  tipos: string[]
  labels: any
}

export default function PublicacoesClient({ publicacoes, tipos, labels }: PublicacoesClientProps) {
  const [tipoAtivo, setTipoAtivo] = useState(labels.all || "Todos")
  const [sortBy, setSortBy] = useState<"ano" | "nome">("ano")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const publicacoesFiltradas = publicacoes
    .filter((pub) => {
      if (tipoAtivo !== (labels.all || "Todos")) {
        return pub.tipo === tipoAtivo
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "ano") {
        return sortOrder === "desc" ? b.ano - a.ano : a.ano - b.ano
      } else {
        return sortOrder === "desc" 
          ? b.nome.localeCompare(a.nome) 
          : a.nome.localeCompare(b.nome)
      }
    })

  return (
    <div className="w-full px-8 pb-8 space-y-8">
      {/* Filters */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl text-muted-foreground">{labels.type || "Tipo"}</h3>
            <h3 className="text-xl md:text-2xl text-muted-foreground mr-40">{labels.sort || "Ordenar"}</h3>            
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
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
            
            {/* Sort Combo Box */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as ["ano" | "nome", "asc" | "desc"]
                    setSortBy(newSortBy)
                    setSortOrder(newSortOrder)
                  }}
                  className="pl-10 pr-6 py-3 md:pl-12 md:pr-8 md:py-4 text-lg md:text-xl rounded-lg border-2 border-border bg-card text-foreground hover:border-primary focus:border-primary focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="ano-desc">{labels.sortByYearNewest || "Ano (Mais Recente)"}</option>
                  <option value="ano-asc">{labels.sortByYearOldest || "Ano (Mais Antigo)"}</option>
                  <option value="nome-asc">{labels.sortByNameAZ || "Nome (A-Z)"}</option>
                  <option value="nome-desc">{labels.sortByNameZA || "Nome (Z-A)"}</option>
                </select>
            </div>
          </div>
        </div>
      </div>

      {/* Publications Horizontal List */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4">
        {publicacoesFiltradas.map((pub) => (
          <Link
            key={pub.id}
            href={`/publicacoes/${pub.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-72 md:w-128"
          >
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={pub.capa}
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
                  {pub.ano}
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground text-balance group-hover:text-primary transition-colors">
                {pub.nome}
              </h3>
              <div className="text-base md:text-lg text-muted-foreground">
                {pub.autores.map((autor, index) => (
                  <div key={index}>{autor}</div>
                ))}
              </div>
              <div 
                className="text-base md:text-lg text-muted-foreground line-clamp-2 prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_ul]:pl-6 [&_ol]:pl-6"
                dangerouslySetInnerHTML={{ __html: pub.descricao }}
              />
              <div className="flex items-center gap-2 text-primary pt-2">
                <span className="text-base md:text-lg">Ver detalhes</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {publicacoesFiltradas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Nenhuma publicação encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
