import { NextRequest } from 'next/server'
import { assetUrl, fetchPessoal, fetchPessoalCount, type FetchPessoalParams } from '@/lib/directus'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get('page') || '1') || 1
  const limit = Math.min(100, Number(searchParams.get('limit') || '20') || 20)
  const q = searchParams.get('q') || undefined
  const docenteParam = searchParams.get('docente') // 'true' | 'false' | 'all'
  let docente: boolean | null = null
  if (docenteParam === 'true') docente = true
  else if (docenteParam === 'false') docente = false
  else docente = null
  const fromYear = searchParams.get('fromYear') ? Number(searchParams.get('fromYear')) : null
  const toYear = searchParams.get('toYear') ? Number(searchParams.get('toYear')) : null
  const sort = (searchParams.get('sort') as FetchPessoalParams['sort']) || 'nome'
  const order = (searchParams.get('order') as FetchPessoalParams['order']) || 'asc'

  const {items, total} = await fetchPessoal({ page, limit, q, docente, fromYear, toYear, sort, order })

  // Shape response and include foto_url
  const data = (items || []).map((it: any) => ({
    id: it.id,
    nome: it.nome,
    numero_processo: it.numero_processo,
    docente: !!it.docente,
    foto: it.foto,
    foto_url: assetUrl(it.foto),
  }))

  return Response.json({ page, limit, total, data })
}
