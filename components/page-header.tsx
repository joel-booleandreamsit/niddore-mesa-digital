interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="max-w-[3000px] mx-auto px-10 py-4 space-y-6 mt-16">
      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground lg:whitespace-nowrap">{title}</h1>
      <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground max-w-7xl leading-relaxed text-balance">
        {description}
      </p>
    </div>
  )
}
