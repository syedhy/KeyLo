export default function AppFilter({ apps , activeApp , onChange , className = "" }) {
    return (
        <div className={`no-scrollbar max-w-full overflow-x-auto pb-0 ${className}`}>
            <div className="flex w-max max-w-none gap-2">
                <FilterButton
                    active={activeApp === "all"}
                    onClick={() => onChange("all")}
                >
                    All
                </FilterButton>

                {apps.map((app) => (
                    <FilterButton
                        key={app.id}
                        active={activeApp === app.id}
                        onClick={() => onChange(app.id)}
                    >
                        {app.name}
                    </FilterButton>
                ))}
            </div>
        </div>
    )
}

function FilterButton({ active , children , onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)] shadow-[0_10px_24px_rgba(38,42,52,0.10)]"
                    : "border-[var(--border)] bg-[var(--paper)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            }`}
        >
            {children}
        </button>
    )
}
