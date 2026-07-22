"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip-enhanced"

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
  const flipBookRef = useRef<any>(null)

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

  // Create pages for flipbook (each photo is a page)
  const pages = fotos.map((foto) => (
    <div
      key={foto.id}
      className="demo-page bg-white border-r-4 border-l-4 border-amber-900/30 shadow-2xl overflow-hidden"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.05) 100%)'
      }}
    >
      <div className="h-full flex flex-col p-6 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 to-white rounded-lg shadow-inner overflow-hidden">
          <img
            src={foto.foto_url}
            alt={foto.nome}
            className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={(e) => {
              e.stopPropagation()
              setOpenId(foto.id)
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-serif text-xl text-gray-800 truncate">{foto.nome}</h3>
        </div>
      </div>
    </div>
  ))

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 overflow-hidden">
      {/* Flipbook Container */}
      <div className="w-full h-full flex items-center justify-center">
        <HTMLFlipBook
          ref={flipBookRef}
          width={800}
          height={600}
          size="stretch"
          minWidth={400}
          maxWidth={window.innerWidth - 40}
          minHeight={300}
          maxHeight={window.innerHeight - 40}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={false}
          startPage={0}
          swipeDistance={50}
          showCover={false}
          mobileScrollSupport={true}
          className="w-full h-full"
          disableFlipByClick={false}
          useMouseEvents={true}
          autoSize={true}
        >
          {pages}
        </HTMLFlipBook>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/70" onClick={close} />
          <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6 pointer-events-none">
            <div
              className={`relative w-[92vw] h-[85vh] md:w-[82vw] md:h-[82vh] lg:w-[80vw] lg:h-[82vh] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 pointer-events-auto ${
                entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              }`}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 text-5xl leading-none px-4 py-2 rounded hover:text-primary z-10 bg-card/80"
                aria-label="Close"
              >
                ×
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                <div className="bg-muted/20 flex items-center justify-center h-full">
                  <img
                    src={selected.foto_url_large || selected.foto_url}
                    alt={selected.nome}
                    className="object-contain w-full max-h-[82vh]"
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
