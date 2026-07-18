export default function WorkspaceHeader({
    actions = null ,
    className = "" ,
    description ,
    eyebrow ,
    compact = false ,
    stats = [] ,
    title
}) {
    const shellClass = compact
        ? "flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between"
        : "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"

    return (
        <section
            className={`workspace-header ${shellClass} ${className}`}
        >
            <div className="max-w-[72rem]">
                {eyebrow && (
                    <p className={`workspace-header__eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--paper-strong)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)] shadow-[0_10px_25px_rgba(20,25,34,0.05)] ${compact ? "sm:px-2.5 sm:py-1" : ""}`}>
                        {eyebrow}
                    </p>
                )}

                <h1 className={`mt-2 font-semibold tracking-[-0.055em] text-[var(--text)] ${compact ? "text-[clamp(1.45rem,2.45vw,3.4rem)] leading-[0.94] sm:text-[clamp(1.65rem,2.85vw,3.4rem)]" : "text-[clamp(1.6rem,3vw,4.1rem)] leading-[0.9] sm:text-[clamp(1.8rem,3.15vw,4.1rem)]"}`}>
                    {title}
                </h1>

                {description && (
                    <p className={`workspace-header__description hidden max-w-3xl text-[clamp(0.92rem,0.45vw+0.8rem,1.05rem)] leading-6 text-[var(--muted)] sm:block ${compact ? "mt-1.5 sm:text-[clamp(0.88rem,0.32vw+0.8rem,0.98rem)]" : "mt-2"}`}>
                        {description}
                    </p>
                )}

                {stats.length > 0 && (
                    <div className={`workspace-header__stats hidden flex-wrap gap-3 sm:flex ${compact ? "mt-2.5" : "mt-3"}`}>
                        {stats.map((stat) => (
                            <StatPill
                                key={`${stat.label}-${stat.value}`}
                                label={stat.label}
                                value={stat.value}
                            />
                        ))}
                    </div>
                )}
            </div>

            {actions && (
                <div className={`workspace-header__actions flex w-full flex-col gap-3 lg:w-auto lg:items-end ${compact ? "lg:min-w-[14rem]" : "lg:min-w-[16rem]"}`}>
                    {actions}
                </div>
            )}
        </section>
    )
}

function StatPill({ label , value }) {
    return (
        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--paper)] px-4 py-2 text-sm text-[var(--text)] shadow-[0_12px_30px_rgba(20,25,34,0.045)]">
            <span className="font-semibold text-[var(--accent-dark)]">
                {value}
            </span>

            <span className="text-[var(--muted)]">
                {label}
            </span>
        </div>
    )
}
