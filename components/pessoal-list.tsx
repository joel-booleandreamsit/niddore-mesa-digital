"use client"

import * as Slider from "@radix-ui/react-slider"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setQ(typingQ), 650)
    return () => clearTimeout(t)
  }, [typingQ])

  // hydrate from URL on mount
  useEffect(() => {
    const q0 = searchParams.get('q') || ''
    const d0 = (searchParams.get('docente') || 'all') as DocenteFilter
    const s0 = (searchParams.get('sortKey') || 'nome-asc') as SortKey
    const fy = Number(searchParams.get('fromYear') || yearBounds.minYear)
    const ty = Number(searchParams.get('toYear') || yearBounds.maxYear)
    setTypingQ(q0)
    setDocFilter(['all','docente','nao'].includes(d0) ? d0 : 'all')
    setSortKey(['nome-asc','nome-desc','proc-asc','proc-desc'].includes(s0) ? s0 : 'nome-asc')
    if (Number.isFinite(fy) && Number.isFinite(ty)) {
      setRange([fy, ty] as [number, number])
      setRangeDraft([fy, ty] as [number, number])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // reflect state to URL (no scroll)
  useEffect(() => {
    const p = new URLSearchParams()
    if (typingQ) p.set('q', typingQ)
    if (docFilter !== 'all') p.set('docente', docFilter)
    p.set('sortKey', sortKey)
    p.set('fromYear', String(range[0]))
    p.set('toYear', String(range[1]))
    const qs = p.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }, [typingQ, docFilter, sortKey, range, router])

  const docenteParam = useMemo(() => (docFilter === 'all' ? 'all' : docFilter === 'docente' ? 'true' : 'false'), [docFilter])
  const [sort, order] = useMemo(() => {
    switch (sortKey) {
      case "nome-asc": return ["nome", "asc"] as const
      case "nome-desc": return ["nome", "desc"] as const
      case "proc-asc": return ["numero_processo", "asc"] as const
      case "proc-desc": return ["numero_processo", "desc"] as const
    }
  }, [sortKey])

  // Client-side accent-insensitive filter for display only (temporary until server supports unaccent)
  const normalize = useCallback((s: string) => (s || '').normalize('NFD').replace(/\p{Diacritic}+/gu, '').toLowerCase(), [])
  const qNorm = useMemo(() => normalize(q), [q, normalize])
  const visibleData = useMemo(() => {
    if (!qNorm) return data
    // if q includes digits only, leave server-side result as-is (process number handled server-side)
    if (/^\d+$/.test(qNorm)) return data
    return data.filter(item => normalize(item.nome).includes(qNorm))
  }, [data, qNorm, normalize])

  // fetch single page (replace or append)
  const loadPage = useCallback(async (targetPage: number, mode: 'replace' | 'append') => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    if (mode === 'replace') setLoading(true)
    else setLoadingMore(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(targetPage))
      params.set('limit', String(PAGE_SIZE))
      // send q to server only when numeric (process number); names are filtered client-side with accent-insensitive match
      if (q && /^\d+$/.test(q.trim())) params.set('q', q.trim())
      params.set('docente', docenteParam)
      if (range[0] != null) params.set('fromYear', String(range[0]))
      if (range[1] != null) params.set('toYear', String(range[1]))
      params.set('sort', sort)
      params.set('order', order)
      const res = await fetch(`/api/pessoal?${params.toString()}`)
      const json = await res.json()
      const next = Array.isArray(json.data) ? json.data : []
      const newTotal = Number(json.total || 0)
      setTotal(newTotal)
      if (mode === 'replace') setData(next)
      else setData(prev => [...prev, ...next])
      const reached = targetPage * PAGE_SIZE >= newTotal || next.length < PAGE_SIZE
      setHasMore(!reached)
    } catch (e) {
      // noop
    } finally {
      if (mode === 'replace') setLoading(false)
      else setLoadingMore(false)
      fetchingRef.current = false
    }
  }, [q, docenteParam, range, sort, order])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [q, docenteParam, range[0], range[1], sortKey])

  useEffect(() => {
    loadPage(1, 'replace')
  }, [loadPage, page])

  // Observe bottom sentinel to load more
  useEffect(() => {
    if (!sentinelRef.current) return
    const node = sentinelRef.current
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && !loading && !loadingMore && hasMore) {
        const nextPage = Math.floor(data.length / PAGE_SIZE) + 1
        if (nextPage > 1) {
          loadPage(nextPage, 'append')
        }
      }
    }, { root: scrollRef.current || null, threshold: 0.1 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [data.length, hasMore, loading, loadingMore, loadPage])

  // no pages in infinite mode

  return (
    <div className="max-w-[3000px] mx-auto px-10 pb-24" aria-busy={loading}>
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
        <div className="text-3xl text-muted-foreground">{labels.results}: {(/^\d+$/.test(qNorm) || !qNorm) ? total : visibleData.length}</div>
        <div className="h-8" />
      </div>

      {/* Table scroll area */}
      <div className="relative max-h-[calc(100vh-28rem)] min-h-[30rem] overflow-y-auto" ref={scrollRef}>
        {loading && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
        <div className={`bg-card border border-border rounded-2xl overflow-hidden ${loading ? 'pointer-events-none' : ''}`}> 
          <div className="grid grid-cols-[8rem_1fr_2fr_10rem] gap-0 items-center bg-muted/30 px-12 py-8 text-3xl text-muted-foreground">
            <div></div>
            <div>{labels.processNumber}</div>
            <div>{labels.name}</div>
            <div>{labels.teacher}</div>
          </div>
          <div className="divide-y divide-border">
            {visibleData.map(item => (
              <Link key={item.id} href={`/pessoal/${item.id}`} className="grid grid-cols-[8rem_1fr_2fr_10rem] gap-0 items-center px-12 py-8 hover:bg-muted/30 transition-colors">
                <div>
                  <img src={item.foto_url} alt={item.nome} className="w-20 h-20 rounded-full object-cover bg-muted border border-border" />
                </div>
                <div className="text-3xl">{item.numero_processo}</div>
                <div className="text-3xl">{item.nome || '-'}</div>
                <div className="text-3xl flex items-center gap-2">{item.docente ? <Check className="text-emerald-500" size={32} /> : <X className="text-rose-500" size={32} />}</div>
              </Link>
            ))}
            {(!loading && visibleData.length === 0) && (
              <div className="p-16 text-3xl text-muted-foreground">—</div>
            )}
            {/* infinite loader sentinel */}
            <div ref={sentinelRef} />
          </div>
        </div>
        {/* Bottom spinner only during infinite load */}
        {loadingMore && (
          <div className="py-6 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
