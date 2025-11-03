"use client"

import * as Slider from "@radix-ui/react-slider"
import { useMemo, useState } from "react"

export type LectiveYear = { start: number; end: number }
export type CursoItem = {
  id: string | number
  nome: string
  descricao?: string | null
  lectiveYears: LectiveYear[]
  edificioId?: string | number | null
}

export type CursosListProps = {
  courses: CursoItem[]
  labels: {
    sort: string
    sortByNameAZ: string
    sortByNameZA: string
    sortByLectiveYearsMost: string
    sortByLectiveYearsLeast: string
    yearRange: string
    resetFilters: string
    lectiveYears: string
    descriptionUnavailable: string
    allBuildings: string
    buildings: string
  }
  edificios: Array<{ id: string | number; name: string; startYear?: number }>
  selectedEdificioId?: string | number | null
}

type SortKey = "name-asc" | "name-desc" | "years-most" | "years-least"

export default function CursosList({ courses, labels, edificios, selectedEdificioId }: CursosListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name-asc")
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({})
  const [selectedBuilding, setSelectedBuilding] = useState<string | number | null>(selectedEdificioId ?? null)

  const { minYear, maxYear } = useMemo(() => {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const c of courses) {
      for (const y of c.lectiveYears) {
        if (Number.isFinite(y.start)) min = Math.min(min, y.start)
        if (Number.isFinite(y.end)) max = Math.max(max, y.end)
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      const now = new Date().getFullYear()
      return { minYear: now - 50, maxYear: now }
    }
    return { minYear: min, maxYear: max }
  }, [courses])

  const [range, setRange] = useState<[number, number]>([minYear, maxYear])

  const filtered = useMemo(() => {
    const [r0, r1] = range
    return courses.filter((c) =>
      (selectedBuilding ? String(c.edificioId ?? "") === String(selectedBuilding) : true) &&
      c.lectiveYears && c.lectiveYears.length > 0
        ? c.lectiveYears.some((y) => y.end >= r0 && y.start <= r1)
        : false
    )
  }, [courses, range, selectedBuilding])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sortKey) {
      case "name-asc":
        arr.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case "name-desc":
        arr.sort((a, b) => b.nome.localeCompare(a.nome))
        break
      case "years-most":
        arr.sort((a, b) => (b.lectiveYears?.length || 0) - (a.lectiveYears?.length || 0))
        break
      case "years-least":
        arr.sort((a, b) => (a.lectiveYears?.length || 0) - (b.lectiveYears?.length || 0))
        break
    }
    return arr
  }, [filtered, sortKey])

  function reset() {
    setRange([minYear, maxYear])
    setSortKey("name-asc")
  }

  return (
    <div className="max-w-[2200px] mx-auto px-20 pb-24">
      {/* Building filter like Publicações + Ordenar */}
      <div className="mb-12 flex items-start justify-between gap-12">
        <div className="flex-1">
          <label className="block text-3xl text-foreground/80 mb-4">{labels.buildings}</label>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedBuilding(null)}
              className={`px-5 py-3 rounded-xl border text-2xl ${!selectedBuilding ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
            >
              {labels.allBuildings}
            </button>
            {edificios
              .slice()
              .sort((a, b) => (a.startYear || 0) - (b.startYear || 0))
              .slice(0, 5)
              .map((b) => {
                const selected = String(selectedBuilding ?? "") === String(b.id)
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBuilding(b.id)}
                    className={`px-5 py-3 rounded-xl border text-2xl ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
                    aria-pressed={selected}
                  >
                    {b.name}
                  </button>
                )
              })}
          </div>
        </div>
        <div className="min-w-[640px]">
          <label className="block text-3xl text-foreground/80 mb-4">{labels.sort}</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="w-full p-5 border rounded-xl bg-card border-border text-2xl"
          >
            <option value="name-asc">{labels.sortByNameAZ}</option>
            <option value="name-desc">{labels.sortByNameZA}</option>
            <option value="years-most">{labels.sortByLectiveYearsMost}</option>
            <option value="years-least">{labels.sortByLectiveYearsLeast}</option>
          </select>
        </div>
      </div>

      {/* Year range label + full-width slider */}
      <div className="mb-4">
        <label className="block text-3xl text-foreground/80 mb-4">{labels.yearRange}</label>
      </div>
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <span className="text-6xl font-bold text-foreground">{range[0]}</span>
          <span className="text-6xl font-bold text-foreground">{range[1]}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none h-10"
          value={range}
          onValueChange={(v) => setRange([v[0], v[1]])}
          min={minYear}
          max={maxYear}
          step={1}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="relative grow rounded-full h-3 bg-border">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="block w-8 h-8 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="Start year" />
          <Slider.Thumb className="block w-8 h-8 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="End year" />
        </Slider.Root>
        <div className="mt-6">
          <button onClick={reset} className="px-6 py-3 border rounded-xl text-2xl bg-card border-border hover:border-primary transition-colors">
            {labels.resetFilters}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border">
          {sorted.map((curso, index) => {
            const count = curso.lectiveYears?.length || 0
            const isOpen = !!expanded[curso.id]
            return (
              <div
                key={curso.id}
                className="p-14 hover:bg-muted/30 transition-colors touch-manipulation"
              >
                <button
                  className="w-full text-left flex items-center justify-between"
                  onClick={() => setExpanded((prev) => ({ ...prev, [curso.id]: !prev[curso.id] }))}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-10">
                    <span className="text-5xl font-serif text-muted-foreground/40 w-28 text-right">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-5xl text-foreground text-balance">
                      {curso.nome}
                    </h3>
                  </div>
                  <span className="text-5xl text-primary font-medium whitespace-nowrap ml-4">
                    {count} {labels.lectiveYears}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-10 space-y-8">
                    {curso.descricao && (
                      <div
                        className="prose prose-3xl max-w-none text-foreground/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: curso.descricao || labels.descriptionUnavailable }}
                      />
                    )}
                    <div className="flex flex-wrap gap-4">
                      {curso.lectiveYears
                        .slice()
                        .sort((a, b) => a.start - b.start)
                        .map((y, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-muted text-foreground border border-border text-2xl">
                          {y.start}/{y.end}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {sorted.length === 0 && (
            <div className="p-20 text-4xl text-muted-foreground">—</div>
          )}
        </div>
      </div>
    </div>
  )
}
