export default function AppFilter({ apps , activeApp , onChange , className = "" }) {
    return (
        <div className={`no-scrollbar max-w-full overflow-x-auto pb-2 ${className}`}>
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
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
                active
                    ? "border-white bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            }`}
        >
            {children}
        </button>
    )
}
