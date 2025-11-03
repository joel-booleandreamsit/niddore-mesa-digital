"use client"

import * as Slider from "@radix-ui/react-slider"
import { useMemo, useState } from "react"

export type LectiveYear = { start: number; end: number }
export type CursoItem = {
  id: string | number
  nome: string
  descricao?: string | null
  lectiveYears: LectiveYear[]
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
  }
}

type SortKey = "name-asc" | "name-desc" | "years-most" | "years-least"

export default function CursosList({ courses, labels }: CursosListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name-asc")
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({})

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
      c.lectiveYears && c.lectiveYears.length > 0
        ? c.lectiveYears.some((y) => y.end >= r0 && y.start <= r1)
        : false
    )
  }, [courses, range])

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
    <div className="max-w-6xl mx-auto px-8 md:px-16 pb-16">
      {/* Controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div className="space-y-3 w-full md:w-[60%]">
          <div className="flex items-center justify-between">
            <span className="text-xl md:text-2xl text-foreground/80">{labels.yearRange}</span>
            <span className="text-lg text-muted-foreground">
              {range[0]} / {range[1]}
            </span>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none h-6"
            value={range}
            onValueChange={(v) => setRange([v[0], v[1]])}
            min={minYear}
            max={maxYear}
            step={1}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="relative grow rounded-full h-1.5 bg-border">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="Start year" />
            <Slider.Thumb className="block w-5 h-5 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="End year" />
          </Slider.Root>
          <button onClick={reset} className="self-start px-4 py-2 border rounded-md text-sm md:text-base bg-card border-border hover:border-primary transition-colors">
            {labels.resetFilters}
          </button>
        </div>

        <div className="w-full md:w-[35%]">
          <label className="block text-xl md:text-2xl text-foreground/80 mb-2">{labels.sort}</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="w-full p-3 border rounded-lg bg-card border-border text-lg"
          >
            <option value="name-asc">{labels.sortByNameAZ}</option>
            <option value="name-desc">{labels.sortByNameZA}</option>
            <option value="years-most">{labels.sortByLectiveYearsMost}</option>
            <option value="years-least">{labels.sortByLectiveYearsLeast}</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="divide-y divide-border">
          {sorted.map((curso, index) => {
            const count = curso.lectiveYears?.length || 0
            const isOpen = !!expanded[curso.id]
            return (
              <div
                key={curso.id}
                className="p-8 md:p-10 hover:bg-muted/30 transition-colors touch-manipulation"
              >
                <button
                  className="w-full text-left flex items-center justify-between"
                  onClick={() => setExpanded((prev) => ({ ...prev, [curso.id]: !prev[curso.id] }))}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-6 md:gap-8">
                    <span className="text-3xl md:text-4xl font-serif text-muted-foreground/40 w-16 text-right">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground text-balance">
                      {curso.nome}
                    </h3>
                  </div>
                  <span className="text-2xl md:text-3xl text-primary font-medium whitespace-nowrap ml-4">
                    {count} {labels.lectiveYears}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-6 md:mt-8 space-y-6">
                    {curso.descricao && (
                      <div
                        className="prose prose-2xl max-w-none text-foreground/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: curso.descricao || labels.descriptionUnavailable }}
                      />
                    )}
                    <div className="flex flex-wrap gap-3">
                      {curso.lectiveYears.map((y, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-muted text-foreground border border-border text-lg">
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
            <div className="p-10 text-2xl text-muted-foreground">—</div>
          )}
        </div>
      </div>
    </div>
  )
}
