import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function GaleriaSubcategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/galeria/categoria/${id}`)
}
