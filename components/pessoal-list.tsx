"use client"

import * as Slider from "@radix-ui/react-slider"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpDown, Check, X } from "lucide-react"

export type PessoalItem = {
  id: string | number
  nome: string
  numero_processo: string
  docente: boolean
  foto_url: string
}

export type YearBounds = { minYear: number; maxYear: number }

export type PessoalListProps = {
  labels: any
  yearBounds: YearBounds
}

const PAGE_SIZE = 20

type SortKey = "nome-asc" | "nome-desc" | "proc-asc" | "proc-desc"

type DocenteFilter = "all" | "docente" | "nao"

export default function PessoalList({ labels, yearBounds }: PessoalListProps) {
  const [q, setQ] = useState("")
  const [typingQ, setTypingQ] = useState("")
  const [docFilter, setDocFilter] = useState<DocenteFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("nome-asc")
  const [range, setRange] = useState<[number, number]>([yearBounds.minYear, yearBounds.maxYear])
  const [rangeDraft, setRangeDraft] = useState<[number, number]>([yearBounds.minYear, yearBounds.maxYear])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<PessoalItem[]>([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setQ(typingQ), 350)
    return () => clearTimeout(t)
  }, [typingQ])

  const docenteParam = useMemo(() => (docFilter === 'all' ? 'all' : docFilter === 'docente' ? 'true' : 'false'), [docFilter])
  const [sort, order] = useMemo(() => {
    switch (sortKey) {
      case "nome-asc": return ["nome", "asc"] as const
      case "nome-desc": return ["nome", "desc"] as const
      case "proc-asc": return ["numero_processo", "asc"] as const
      case "proc-desc": return ["numero_processo", "desc"] as const
    }
  }, [sortKey])

  // fetch
  const fetchPage = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PAGE_SIZE))
      if (q) params.set('q', q)
      params.set('docente', docenteParam)
      if (range[0] != null) params.set('fromYear', String(range[0]))
      if (range[1] != null) params.set('toYear', String(range[1]))
      params.set('sort', sort)
      params.set('order', order)
      const res = await fetch(`/api/pessoal?${params.toString()}`)
      const json = await res.json()
      setData(json.data || [])
      setTotal(json.total || 0)
    } catch (e) {
      // noop
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [page, q, docenteParam, range, sort, order])

  useEffect(() => {
    setPage(1)
  }, [q, docenteParam, range[0], range[1], sortKey])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="max-w-[3000px] mx-auto px-10 pb-24 relative" aria-busy={loading}>
      {loading && (
        <div className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}
      {/* Controls */}
      <div className="space-y-10 mt-16 mb-12">
        <div className={`flex flex-wrap items-start gap-6 justify-between ${loading ? 'pointer-events-none opacity-60' : ''}`}>
          {/* Search */}
          <div className="flex-1 min-w-[40rem]">
            <label className="block text-3xl text-muted-foreground mb-3">{labels.search}</label>
            <input
              value={typingQ}
              onChange={(e) => setTypingQ(e.target.value)}
              placeholder={labels.searchPlaceholder}
              disabled={loading}
              className="w-full px-8 py-6 text-3xl rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Docente filter */}
          <div className="flex flex-col gap-3">
            <label className="block text-3xl text-muted-foreground mb-3">{labels.filterPeople}</label>
            <div className="flex gap-3">
              {([
                { k: 'all', l: labels.allPeople },
                { k: 'docente', l: labels.onlyTeachers },
                { k: 'nao', l: labels.onlyNonTeachers },
              ] as const).map((opt) => (
                <button
                  key={opt.k}
                  onClick={() => setDocFilter(opt.k)}
                  disabled={loading}
                  className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${docFilter===opt.k? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary'} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col">
            <label className="block text-3xl text-muted-foreground mb-3">{labels.sort}</label>
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground pointer-events-none" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                disabled={loading}
                className="pl-20 pr-12 py-6 text-3xl rounded-lg border-2 border-border bg-card text-foreground hover:border-primary focus:border-primary focus:outline-none transition-all duration-300 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="nome-asc">{labels.sortByNameAZ}</option>
                <option value="nome-desc">{labels.sortByNameZA}</option>
                <option value="proc-asc">{labels.sortByProcessOldest}</option>
                <option value="proc-desc">{labels.sortByProcessNewest}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Year slider */}
      <div className="mb-4">
        <label className="block text-3xl text-foreground/80 mb-4">{labels.yearRange}</label>
      </div>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-6xl font-bold text-foreground">{rangeDraft[0]}</span>
          <span className="text-6xl font-bold text-foreground">{rangeDraft[1]}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none h-10"
          value={rangeDraft}
          onValueChange={(v) => setRangeDraft([v[0], v[1]])}
          onValueCommit={(v) => setRange([v[0], v[1]])}
          disabled={loading}
          min={yearBounds.minYear}
          max={yearBounds.maxYear}
          step={1}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="relative grow rounded-full h-3 bg-border">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="block w-8 h-8 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="Start year" />
          <Slider.Thumb className="block w-8 h-8 rounded-full bg-primary shadow-[0_2px_10px] shadow-black/20 hover:scale-105 transition-transform" aria-label="End year" />
        </Slider.Root>
      </div>

      {/* Results + pagination */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl text-muted-foreground flex items-center gap-4">{labels.results}: {total} {loading && (<span className="inline-block w-6 h-6 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />)}</div>
        <div className="flex items-center gap-4">
          <button disabled={page<=1 || loading} onClick={() => setPage(p => Math.max(1, p-1))} className={`px-6 py-3 text-2xl rounded-lg border ${(page<=1||loading)? 'opacity-50 cursor-not-allowed': 'hover:border-primary'}`}>&lt;</button>
          <span className="text-3xl">{labels.page} {page} {labels.of} {totalPages}</span>
          <button disabled={page>=totalPages || loading} onClick={() => setPage(p => Math.min(totalPages, p+1))} className={`px-6 py-3 text-2xl rounded-lg border ${(page>=totalPages||loading)? 'opacity-50 cursor-not-allowed': 'hover:border-primary'}`}>&gt;</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[8rem_1fr_2fr_10rem] gap-0 items-center bg-muted/30 px-12 py-8 text-3xl text-muted-foreground">
          <div></div>
          <div>{labels.processNumber}</div>
          <div>{labels.name}</div>
          <div>{labels.teacher}</div>
        </div>
        <div className="divide-y divide-border">
          {data.map(item => (
            <Link key={item.id} href={`/pessoal/${item.id}`} className="grid grid-cols-[8rem_1fr_2fr_10rem] gap-0 items-center px-12 py-8 hover:bg-muted/30 transition-colors">
              <div>
                <img src={item.foto_url} alt={item.nome} className="w-16 h-16 rounded-full object-cover bg-muted border border-border" />
              </div>
              <div className="text-3xl">{item.numero_processo}</div>
              <div className="text-3xl">{item.nome || '-'}</div>
              <div className="text-3xl flex items-center gap-2">{item.docente ? <Check className="text-emerald-500" /> : <X className="text-rose-500" />}</div>
            </Link>
          ))}
          {(!loading && data.length === 0) && (
            <div className="p-16 text-3xl text-muted-foreground">—</div>
          )}
          {loading && (
            <div className="p-16 text-3xl text-muted-foreground">Loading…</div>
          )}
        </div>
      </div>
    </div>
  )
}
