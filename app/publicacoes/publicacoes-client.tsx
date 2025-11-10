"use client"

import { useState } from "react"
import Link from "next/link"
import { FilterButtons, SortSelect } from "@/components/filters"
import { HorizontalList } from "@/components/horizontal-list"

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
    <div className="w-full h-full px-20 pb-24 space-y-20 mt-16">
      {/* Filters */}
      <div className="space-y-16">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-4xl text-muted-foreground">{labels.type}</h3>
            <h3 className="text-4xl text-muted-foreground mr-64">{labels.sort}</h3>            
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <FilterButtons options={tipos} active={tipoAtivo} onChange={setTipoAtivo} />

            <SortSelect
              value={`${sortBy}-${sortOrder}`}
              onChange={(v) => {
                const [newSortBy, newSortOrder] = v.split('-') as ["ano" | "nome", "asc" | "desc"]
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}
              options={[
                { value: "ano-desc", label: labels.sortByYearNewest },
                { value: "ano-asc", label: labels.sortByYearOldest },
                { value: "nome-asc", label: labels.sortByNameAZ },
                { value: "nome-desc", label: labels.sortByNameZA },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Publications Horizontal List */}
      <HorizontalList>
        {publicacoesFiltradas.map((pub) => (
          <Link
            key={pub.id}
            href={`/publicacoes/${pub.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-[40rem]"
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={pub.capa}
                alt={pub.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-block px-4 py-2 text-xl bg-secondary text-secondary-foreground rounded-full">
                  {pub.tipo}
                </span>
                <span className="text-2xl text-muted-foreground">
                  {pub.ano}
                </span>
              </div>
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors">
                {pub.nome}
              </h3>
              <div className="text-2xl text-muted-foreground">
                {pub.autores.map((autor, index) => (
                  <div key={index}>{autor}</div>
                ))}
              </div>
              <div 
                className="text-2xl text-muted-foreground line-clamp-2 prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4 [&_ul]:pl-6 [&_ol]:pl-6"
                dangerouslySetInnerHTML={{ __html: pub.descricao }}
              />
            </div>
          </Link>
        ))}
      </HorizontalList>

      {publicacoesFiltradas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Nenhuma publicação encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}

