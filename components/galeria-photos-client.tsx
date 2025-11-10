"use client"

import { useEffect, useMemo, useState } from "react"

type Foto = {
  id: string | number
  nome: string
  breve: string
  descricao: string
  foto_url: string
  foto_url_large: string
}

export default function GaleriaPhotosClient({
  fotos,
  breadcrumbs,
}: {
  fotos: Foto[]
  breadcrumbs: string[]
}) {
  const [openId, setOpenId] = useState<string | number | null>(null)
  const [entered, setEntered] = useState(false)

  const selected = useMemo(() => fotos.find((f) => f.id === openId) || null, [fotos, openId])

  useEffect(() => {
    if (openId != null) {
      const t = setTimeout(() => setEntered(true), 15)
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close()
      }
      document.addEventListener("keydown", onKey)
      return () => {
        clearTimeout(t)
        document.removeEventListener("keydown", onKey)
        setEntered(false)
      }
    }
  }, [openId])

  function close() {
    setEntered(false)
    setTimeout(() => setOpenId(null), 200)
  }

  return (
    <div>
      <div className="grid grid-cols-4 xl:grid-cols-5 gap-16">
        {fotos.map((foto) => (
          <button
            key={foto.id}
            onClick={() => setOpenId(foto.id)}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 touch-manipulation active:scale-98 text-left"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={foto.foto_url}
                alt={foto.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-10 space-y-6 mb-10">
              <h3 className="font-serif text-5xl text-foreground text-balance group-hover:text-primary transition-colors leading-tight">
                {foto.nome}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6" onClick={close}>
            <div
              className={`relative w-[92vw] h-[85vh] md:w-[82vw] md:h-[82vh] lg:w-[80vw] lg:h-[82vh] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              }`}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 text-5xl leading-none px-4 py-2 rounded hover:text-primary"
                aria-label="Close"
              >
                ×
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                <div className="bg-muted/20 flex items-center justify-center h-full">
                  <img
                    src={selected.foto_url_large || selected.foto_url}
                    alt={selected.nome}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-8 md:p-12 space-y-10 h-full overflow-y-auto">
                  <h3 className="font-serif text-7xl md:text-8xl text-foreground leading-tight">{selected.nome}</h3>
                  <div className="text-3xl md:text-5xl text-muted-foreground">{breadcrumbs.join(" > ")}</div>
                  <div
                    className="text-2xl md:text-4xl leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: selected.descricao }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
