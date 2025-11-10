"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { FilterButtons, SortSelect } from "@/components/filters"
import { HorizontalList } from "@/components/horizontal-list"
import type { Lang } from "@/lib/i18n"

interface Servico {
  id: number
  nome: string
  data_inicio: string | null
  data_fim: string | null
  foto_capa: string
  isActive: boolean
}

interface ServicosClientProps {
  servicos: Servico[]
  statusOptions: string[]
  labels: any
  lang: Lang
}

export default function ServicosClient({ servicos, statusOptions, labels, lang }: ServicosClientProps) {
  const [statusAtivo, setStatusAtivo] = useState(labels.all || "Todos")
  const [sortBy, setSortBy] = useState<"data_inicio" | "nome">("data_inicio")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const servicosFiltrados = servicos
    .filter((servico) => {
      if (statusAtivo === (labels.all || "Todos")) {
        return true
      } else if (statusAtivo === (labels.active || "Ativo")) {
        return servico.isActive
      } else if (statusAtivo === "Inativo") {
        return !servico.isActive
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "data_inicio") {
        const dateA = new Date(a.data_inicio || '1900-01-01')
        const dateB = new Date(b.data_inicio || '1900-01-01')
        return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      } else {
        return sortOrder === "desc" 
          ? b.nome.localeCompare(a.nome) 
          : a.nome.localeCompare(b.nome)
      }
    })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full h-full px-20 pb-24 space-y-20 mt-16">
      {/* Filters */}
      <div className="space-y-16">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-4xl text-muted-foreground">{labels.status}</h3>
            <h3 className="text-4xl text-muted-foreground mr-64">{labels.sort}</h3>            
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <FilterButtons options={statusOptions} active={statusAtivo} onChange={setStatusAtivo} />

            <SortSelect
              value={`${sortBy}-${sortOrder}`}
              onChange={(v) => {
                const [newSortBy, newSortOrder] = v.split('-') as ["data_inicio" | "nome", "asc" | "desc"]
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}
              options={[
                { value: "data_inicio-desc", label: labels.sortByYearNewest || "Data (Mais Recente)" },
                { value: "data_inicio-asc", label: labels.sortByYearOldest || "Data (Mais Antigo)" },
                { value: "nome-asc", label: labels.sortByNameAZ || "Nome (A-Z)" },
                { value: "nome-desc", label: labels.sortByNameZA || "Nome (Z-A)" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Services Horizontal List */}
      <HorizontalList>
        {servicosFiltrados.map((servico) => (
          <Link
            key={servico.id}
            href={`/servicos/${servico.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-[40rem]"
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={servico.foto_capa}
                alt={servico.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-4 pb-16">
              <div className="flex items-center justify-between gap-8">
                <span className="inline-block px-4 py-2 text-xl bg-secondary text-secondary-foreground rounded-full">
                  {servico.isActive ? labels.active : labels.inactive}
                </span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-8 h-8" />
                  <span className="text-2xl">
                    {formatDate(servico.data_inicio) || labels.notAvailable}
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors">
                {servico.nome}
              </h3>
              
            </div>
          </Link>
        ))}
      </HorizontalList>

      {servicosFiltrados.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhum serviço encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
