import { ReactNode } from "react"

export function HorizontalList({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-20 overflow-x-auto pb-4 mt-32">
      {children}
    </div>
  )
}
