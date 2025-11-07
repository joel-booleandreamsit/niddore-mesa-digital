import { BackButton } from "@/components/back-button"
import { fetchGrupos, assetUrl } from "@/lib/directus"
import { t, getLang } from "@/lib/i18n"
import GruposClient from "./grupos-client"

export const dynamic = 'force-dynamic'

export default async function GruposPage() {
  const lang = await getLang()
  const labels = t(lang)
  const data = await fetchGrupos(lang)

  // Transform data to match expected format
  const grupos = data.map((item: any) => ({
    ...item,
    nome: item.translations?.[0]?.nome || labels.nameUnavailable,
    tipo_grupo: item.tipo_grupo_translated || item.tipo_grupo || labels.typeUnavailable,
    foto_capa: item.foto_capa ? assetUrl(item.foto_capa, "fit=cover&width=400&height=300&format=webp") : '/placeholder.svg',
  }))

  // Generate dynamic filters based on tipo_grupo
  const tipos = [labels.all, ...Array.from(new Set(grupos.map(grupo => grupo.tipo_grupo).filter(Boolean)))]

  return (
    <main className="h-screen bg-background overflow-hidden flex flex-col">
      <BackButton label={labels.back} />
      
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center px-12 py-8 bg-gradient-to-b from-background via-background/95 to-background/80">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-foreground tracking-tight text-balance leading-none">
            {labels.groups || "Grupos"}
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-serif italic text-balance">{labels.groupsDesc || "Os grupos da escola"}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <GruposClient 
          grupos={grupos}
          tipos={tipos}
          labels={labels}
        />
      </div>
    </main>
  )
}
