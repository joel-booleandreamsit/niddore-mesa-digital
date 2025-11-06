"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type Categoria = { id: string | number; nome: string; foto_url: string }
type Edificio = { id: string | number; nome: string }
type LinkEntry = { categoriaId: string | number; edificioId: string | number }

type Props = {
  categorias: Categoria[]
  edificios: Edificio[]
  links: LinkEntry[]
  labels: any
  tipo: 'Material' | 'Trabalho'
}

export default function MateriaisCategoriasClient({ categorias, edificios, links, labels, tipo }: Props) {
  const searchParams = useSearchParams()
  const initial = searchParams.get("edificio") || "all"
  const [selectedEdificio, setSelectedEdificio] = useState<string | number>(initial)

  useEffect(() => {
    const v = searchParams.get("edificio") || "all"
    setSelectedEdificio(v)
  }, [searchParams])

  const categoriasFiltradas = useMemo(() => {
    if (selectedEdificio === "all") return categorias
    const edif = String(selectedEdificio)
    const set = new Set(
      links
        .filter((l) => String(l.edificioId) === edif && l.categoriaId != null)
        .map((l) => String(l.categoriaId))
    )
    return categorias.filter((c) => set.has(String(c.id)))
  }, [categorias, links, selectedEdificio])

  return (
    <div className="px-20 pb-24 space-y-20 mt-16">
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

      <div className="grid grid-cols-4 gap-16">
        {categoriasFiltradas.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/materiais/categorias/${categoria.id}?tipo=${encodeURIComponent(tipo)}${selectedEdificio === "all" ? "" : `&edificio=${encodeURIComponent(String(selectedEdificio))}`}`}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={categoria.foto_url}
                alt={categoria.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-6">
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {categoria.nome}
              </h3>              
            </div>
          </Link>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-32">
          <p className="text-4xl text-muted-foreground font-medium">Nenhuma categoria encontrada.</p>
        </div>
      )}
    </div>
  )
}
