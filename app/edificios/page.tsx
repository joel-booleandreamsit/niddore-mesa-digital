import { BackButton } from "@/components/back-button"
import { PageHeader } from "@/components/page-header"
import fetchEdificios, { assetUrl } from "@/lib/directus"

export default async function EdificiosPage() {
	const data = await fetchEdificios()

	return (
		<main className="min-h-screen bg-background">
			<BackButton />
			<PageHeader title="Edifícios" description="As instalações da escola ao longo da sua história" />

			<div className="max-w-7xl mx-auto px-8 md:px-16 pb-16">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
					{data.map((edificio) => (
						<div
							key={edificio.id}
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
									<h3 className="font-serif text-3xl md:text-4xl text-foreground text-balance">{edificio.nome}</h3>
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
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}
