import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import { fetchEdificios, assetUrl } from "@/lib/static-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { t, getLang } from "@/lib/i18n"

export const dynamic = 'force-static'

export default async function EdificiosPage() {
    const lang = await getLang()
    const labels = t(lang)
    const data = await fetchEdificios(lang)

        // Use translations from Directus if available, otherwise fallback to original
        const translatedData = data.map((item: any) => ({
            ...item,
            nome: item.translations?.[0]?.nome || 'Nome não disponível',
            descricao: item.translations?.[0]?.descricao || 'Descrição não disponível',
        }))

	return (
		<main className="min-h-screen bg-background">
			<BackButton />
            <PageHeader title={labels.buildings} description={labels.buildingsDesc} />

			<div className="max-w-7xl mx-auto px-8 md:px-16 pb-16">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
					{translatedData.map((edificio: any) => (
						<Link
							key={edificio.id}
							href={`/edificios/${edificio.id}`}
							className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
						>
							<div className="aspect-[3/2] overflow-hidden">
								<img
									src={assetUrl(edificio.imagem, "fit=cover&width=1200&height=800&format=webp")}
									alt={edificio.nome}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>
							<div className="p-8 md:p-10 space-y-4">
								<div className="flex items-baseline justify-between gap-4">
									<h3 className="font-serif text-3xl md:text-4xl text-foreground text-balance group-hover:text-primary transition-colors">{edificio.nome}</h3>
									<span className="text-xl md:text-2xl text-primary font-medium whitespace-nowrap">
										{edificio.ano_construcao ?? ""}
									</span>
								</div>
								{edificio.localizacao ? (
									<p className="text-lg md:text-xl text-muted-foreground">{edificio.localizacao}</p>
								) : null}
								{edificio.descricao ? (
									<p className="text-base md:text-lg text-foreground/80 leading-relaxed text-pretty">
										{edificio.descricao}
									</p>
								) : null}
                                <div className="flex items-center gap-2 text-primary pt-2">
                                    <span className="text-base md:text-lg">{labels.viewDetails}</span>
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</main>
	)
}
