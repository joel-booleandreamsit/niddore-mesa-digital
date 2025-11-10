"use client"

import { ArrowUpDown } from "lucide-react"

export function FilterButtons({
  options,
  active,
  onChange,
}: {
  options: string[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-12 py-6 text-3xl rounded-lg border-2 transition-all duration-300 touch-manipulation active:scale-95 ${
            active === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function SortSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-20 pr-12 py-6 text-3xl rounded-lg border-2 border-border bg-card text-foreground hover:border-primary focus:border-primary focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
