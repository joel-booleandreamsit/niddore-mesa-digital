"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type Item = {
  id: string | number
  nome: string
  breve?: string
  foto_url: string
  edificioId?: string | number | null
}

type Edificio = { id: string | number; nome: string }

type Props = {
  items: Item[]
  edificios: Edificio[]
  labels: any
  tipo: "Material" | "Trabalho"
}

export default function MateriaisCategoriaClient({ items, edificios, labels, tipo }: Props) {
  const [selectedEdificio, setSelectedEdificio] = useState<string | number>("all")

  // Keep URL in sync if query param exists
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const v = sp.get("edificio") || "all"
    setSelectedEdificio(v)
  }, [])

  const filtered = useMemo(() => {
    if (selectedEdificio === "all") return items
    const edif = String(selectedEdificio)
    return items.filter((it) => (it.edificioId != null ? String(it.edificioId) === edif : false))
  }, [items, selectedEdificio])

  return (
    <div className="px-20 pb-24 space-y-20 mt-16">
      {/* Building filter */}
      <div className="flex flex-wrap gap-6 justify-center">
        <button
          onClick={() => setSelectedEdificio("all")}
          className={`px-10 py-5 text-3xl rounded-lg border-2 transition-all ${
            selectedEdificio === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary"
          }`}
        >
          {labels.allBuildings || "Todos os edifícios"}
        </button>
        {edificios.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEdificio(e.id)}
            className={`px-10 py-5 text-3xl rounded-lg border-2 transition-all ${
              String(selectedEdificio) === String(e.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            {e.nome}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-4 xl:grid-cols-5 gap-16">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/materiais/${item.id}?tipo=${encodeURIComponent(tipo)}`}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={item.foto_url}
                alt={item.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-6">
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {item.nome}
              </h3>
              {item.breve && (
                <p className="text-2xl text-foreground/80 leading-relaxed">{item.breve}</p>
              )}
              
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">{labels.noneFound || "Nenhum item encontrado."}</p>
        </div>
      )}
    </div>
  )
}
