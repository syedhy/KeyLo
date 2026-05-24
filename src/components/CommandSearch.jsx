import { useEffect , useMemo , useState } from "react"

export default function CommandSearch({ shortcuts , onSelect }) {
    const [open , setOpen] = useState(false)
    const [query , setQuery] = useState("")

    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(true)
            }

            if (e.key === "Escape") {
                setOpen(false)
            }
        }

        window.addEventListener("keydown" , handleKeyDown)

        return () => {
            window.removeEventListener("keydown" , handleKeyDown)
        }
    } , [])

    const results = useMemo(() => {
        const text = query.toLowerCase().trim()

        if (!text) {
            return shortcuts.slice(0 , 8)
        }

        return shortcuts
            .filter((shortcut) => {
                const searchable =
                    `${shortcut.app} ${shortcut.title} ${shortcut.description || ""} ${shortcut.keys.join(" ")} ${formatShortcut(shortcut.keys)}`
                        .toLowerCase()

                return searchable.includes(text)
            })
            .slice(0 , 10)
    } , [query , shortcuts])

    if (!open) return null

    return (
        <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-md"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
            >
                <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search shortcuts..."
                    className="w-full border-b border-[var(--border)] bg-transparent px-6 py-5 text-lg text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                />

                <div className="max-h-[420px] overflow-y-auto p-3">
                    {results.map((shortcut) => (
                        <button
                            key={`${shortcut.app}-${shortcut.title}`}
                            onClick={() => {
                                onSelect(shortcut)
                                setOpen(false)
                                setQuery("")
                            }}
                            className="w-full rounded-2xl p-4 text-left transition-colors hover:bg-[var(--bg)]"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-[var(--muted)]">
                                        {shortcut.app}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                                        {shortcut.title}
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        {shortcut.description || "No description added yet"}
                                    </p>
                                </div>

                                <p className="shrink-0 text-sm text-[var(--accent-dark)]">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </div>
                        </button>
                    ))}

                    {results.length === 0 && (
                        <p className="p-6 text-sm text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function formatKey(key) {
    const labels = {
        CmdLeft : "Cmd" ,
        CmdRight : "Cmd" ,
        OptionLeft : "Option" ,
        OptionRight : "Option" ,
        ShiftLeft : "Shift" ,
        ShiftRight : "Shift" ,
        ControlLeft : "Control" ,
        ControlRight : "Control"
    }

    return labels[key] || key
}

function formatShortcut(keys) {
    return keys.map(formatKey).join(" + ")
}