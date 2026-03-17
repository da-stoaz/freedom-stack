type Props = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}

export function SectionHeader({ eyebrow, title, description, centered = false }: Props) {
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : ''}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary dark:text-brand-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100 md:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  )
}
