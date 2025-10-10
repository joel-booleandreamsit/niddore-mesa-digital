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
  },
  en: {
    buildings: "Buildings",
    buildingsDesc: "The school's facilities throughout its history",
    viewDetails: "View details",
    yearBuilt: "Year built",
    location: "Location",
    aboutBuilding: "About this building",
  },
} as const

export function t(lang: Lang) {
  return labels[lang]
}


