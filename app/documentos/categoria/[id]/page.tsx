import { BackButton } from "@/components/back-button"
import { fetchDocumentoCategoriaById, fetchDocumentosByCategoria, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DocumentosCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const categoriaId = Number.isNaN(Number(id)) ? id : Number(id)
    const lang = await getLang()
    const labels = t(lang)

    // Fetch category; if it fails or doesn't exist, show 404
    let categoria: any
    try {
      categoria = await fetchDocumentoCategoriaById(categoriaId, lang)
    } catch {
      notFound()
    }
    if (!categoria || !categoria.id) notFound()

    console.log(categoria)

    // Fetch documents; if it fails, fallback to empty list (no 404)
    let documentos: any[] = []
    try {
      documentos = await fetchDocumentosByCategoria(categoriaId, lang)
    } catch {
      documentos = []
    }

    console.log(documentos)

    const categoriaNome = categoria.translations?.[0]?.nome || 'Nome não disponível'

    const formatDate = (dateString: string | null) => {
      if (!dateString) return null
      return new Date(dateString).toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    }

    const documentosTransformados = documentos.map((doc: any) => ({
      ...doc,
      nome: doc.translations?.[0]?.nome || 'Nome não disponível',
      breve_descricao: doc.translations?.[0]?.breve_descricao || 'Descrição não disponível',
      data_fmt: formatDate(doc.data),
      capa_url: doc.capa ? assetUrl(doc.capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
    }))

    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label={labels.back || "Voltar"} />

        <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
              {categoriaNome}
            </h1>
            <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.documents || "Documentos"}</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="px-20 pb-24 space-y-20 mt-16">
            <div className="grid grid-cols-4 gap-16">
              {documentosTransformados.map((doc: any) => (
                <Link
                  key={doc.id}
                  href={`/documentos/${doc.id}`}
                  className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={doc.capa_url}
                      alt={doc.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-10 space-y-4">
                    <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                      {doc.nome}
                    </h3>
                    <div className="text-2xl text-muted-foreground line-clamp-2">{doc.breve_descricao}</div>
                    <div className="flex items-center gap-3 text-muted-foreground pt-2">
                      <Calendar className="w-6 h-6" />
                      <span className="text-2xl">{doc.data_fmt || '—'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-primary pt-2">
                      <span className="text-2xl font-medium">{labels.viewDetails || "Ver detalhes"}</span>
                      <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {documentosTransformados.length === 0 && (
              <div className="text-center py-32">
                <p className="text-4xl text-muted-foreground font-medium">Nenhum documento encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className="h-screen bg-background overflow-hidden flex flex-col">
        <BackButton label="Voltar" />
        <div className="flex-1 px-8 pb-8 overflow-y-auto flex items-center justify-center">
          <p className="text-4xl text-muted-foreground font-medium">Ocorreu um erro ao carregar a categoria de documentos.</p>
        </div>
      </main>
    )
  }
}
