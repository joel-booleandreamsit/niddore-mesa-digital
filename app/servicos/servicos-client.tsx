"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Calendar } from "lucide-react"
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
    <div className="w-full px-16 pb-24 space-y-24">
      {/* 4K Optimized Filters */}
      <div className="space-y-20">
        <div>
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-6xl text-muted-foreground font-medium">{labels.status || "Status"}</h3>
            <h3 className="text-6xl text-muted-foreground font-medium">{labels.sort || "Ordenar"}</h3>            
          </div>
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6 items-center">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusAtivo(status)}
                  className={`px-16 py-8 text-4xl rounded-xl border-3 transition-all duration-300 touch-manipulation active:scale-95 font-medium ${
                    statusAtivo === status
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            {/* Sort Combo Box */}
            <div className="relative">
              <ArrowUpDown className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 text-muted-foreground pointer-events-none" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as ["data_inicio" | "nome", "asc" | "desc"]
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
                className="pl-24 pr-16 py-8 text-4xl rounded-xl border-3 border-border bg-card text-foreground hover:border-primary focus:border-primary focus:outline-none transition-all duration-300 appearance-none cursor-pointer font-medium"
              >
                <option value="data_inicio-desc">{labels.sortByYearNewest || "Data (Mais Recente)"}</option>
                <option value="data_inicio-asc">{labels.sortByYearOldest || "Data (Mais Antigo)"}</option>
                <option value="nome-asc">{labels.sortByNameAZ || "Nome (A-Z)"}</option>
                <option value="nome-desc">{labels.sortByNameZA || "Nome (Z-A)"}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4K Optimized Services Horizontal List */}
      <div className="flex gap-32 overflow-x-auto pb-8">
        {servicosFiltrados.map((servico) => (
          <Link
            key={servico.id}
            href={`/servicos/${servico.id}`}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98 flex-shrink-0 w-[56rem]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={servico.foto_capa}
                alt={servico.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-16 space-y-8">
              <div className="flex items-center justify-between gap-8">
                <span className={`inline-block px-8 py-4 text-3xl rounded-full font-medium ${
                  servico.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}>
                  {servico.isActive ? labels.active : labels.inactive}
                </span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Calendar className="w-10 h-10" />
                  <span className="text-3xl font-medium">
                    {formatDate(servico.data_inicio) || labels.notAvailable}
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-7xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {servico.nome}
              </h3>
              
            </div>
          </Link>
        ))}
      </div>

      {servicosFiltrados.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhum serviço encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
