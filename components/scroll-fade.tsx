"use client"

import { useEffect, useRef, useState } from "react"

type ScrollFadeProps = {
  html: string
  containerClassName?: string
  contentClassName?: string
  gradientClassName?: string
}

export function ScrollFade({
  html,
  containerClassName = "relative",
  contentClassName = "h-[68rem] overflow-y-auto pr-4",
  gradientClassName = "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none",
}: ScrollFadeProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const { scrollTop, clientHeight, scrollHeight } = el
      const reached = scrollTop + clientHeight >= scrollHeight - 2
      setAtBottom(reached)
    }

    // Initial check and on content load (in case of images/fonts affecting height)
    update()
    const handle = () => update()
    el.addEventListener("scroll", handle, { passive: true })

    // Also observe size changes that might affect scrollHeight
    const ro = new ResizeObserver(() => update())
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", handle)
      ro.disconnect()
    }
  }, [])

  return (
    <div className={containerClassName}>
      <div ref={scrollRef} className={contentClassName}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {!atBottom && <div className={gradientClassName} />}
    </div>
  )
}
