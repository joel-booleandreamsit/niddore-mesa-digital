import { cookies } from "next/headers"

export type Lang = "pt" | "en"

export async function getLang(): Promise<Lang> {
  try {
    const c = (await cookies()).get("lang")?.value
    return c === "en" ? "en" : "pt"
  } catch {
    return "pt"
  }
}

const labels = {
  pt: {
    buildings: "Edifícios",
    buildingsDesc: "As instalações da escola ao longo da sua história",
    viewDetails: "Ver detalhes",
    yearBuilt: "Ano de construção",
    location: "Localização",
    aboutBuilding: "Sobre este edifício",
    publications: "Publicações",
    publicationsDesc: "Publicações da escola ao longo dos anos",
    type: "Tipo",
    back: "Voltar",
    sort: "Ordenar",
    all: "Todos",
    sortByYearNewest: "Ano (Mais Recente)",
    sortByYearOldest: "Ano (Mais Antigo)",
    sortByNameAZ: "Nome (A-Z)",
    sortByNameZA: "Nome (Z-A)",
  },
  en: {
    buildings: "Buildings",
    buildingsDesc: "The school's facilities throughout its history",
    viewDetails: "View details",
    yearBuilt: "Year built",
    location: "Location",
    aboutBuilding: "About this building",
    publications: "Publications",
    publicationsDesc: "School publications over the years",
    type: "Type",
    back: "Back",
    sort: "Sort",
    all: "All",
    sortByYearNewest: "Year (Newest)",
    sortByYearOldest: "Year (Oldest)",
    sortByNameAZ: "Name (A-Z)",
    sortByNameZA: "Name (Z-A)",
  },
} as const

export function t(lang: Lang) {
  return labels[lang]
}


