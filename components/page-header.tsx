interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-4 space-y-6">
      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground text-balance">{title}</h1>
      <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground max-w-4xl leading-relaxed text-balance">
        {description}
      </p>
    </div>
  )
}
