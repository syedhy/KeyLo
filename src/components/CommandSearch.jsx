import { useEffect , useMemo , useRef , useState } from "react"

import {
    formatShortcut ,
    searchShortcuts
} from "../utils/shortcuts"

export default function CommandSearch({ shortcuts , onSelect }) {
    const [open , setOpen] = useState(false)
    const [query , setQuery] = useState("")
    const inputRef = useRef(null)

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

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus()
            } , 0)
        }
    } , [open])

    const results = useMemo(() => {
        return searchShortcuts(shortcuts , query , {
            limit : 10
        })
    } , [query , shortcuts])

    if (!open) return null

    return (
        <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(24,27,36,0.44)] px-4 py-4 backdrop-blur-lg sm:pt-24"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[calc(100vh_-_2rem)] max-h-[calc(100dvh_-_2rem)] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] shadow-[var(--shadow)]"
            >
                <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                                Quick search
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                Find shortcuts by app, title, or key combo
                            </p>
                        </div>

                        <kbd className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                            Cmd K
                        </kbd>
                    </div>

                    <input
                        ref={inputRef}
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search cmd p, duplicate line, focus search..."
                        className="mt-4 w-full rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                    />
                </div>

                <div className="max-h-[calc(100vh_-_13rem)] max-h-[calc(100dvh_-_13rem)] overflow-y-auto p-3">
                    {results.map((shortcut) => (
                        <button
                            type="button"
                            key={`${shortcut.app}-${shortcut.title}`}
                            onClick={() => {
                                onSelect(shortcut)
                                setOpen(false)
                                setQuery("")
                            }}
                            className="w-full rounded-[1.5rem] border border-transparent p-4 text-left transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
                        >
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                                        {shortcut.app}
                                    </p>

                                    <p className="mt-1 text-[1.02rem] font-semibold tracking-[-0.02em] text-[var(--text)]">
                                        {shortcut.title}
                                    </p>

                                    <p className="mt-1 break-words text-sm text-[var(--muted)]">
                                        {shortcut.description || "No description added yet"}
                                    </p>
                                </div>

                                <p className="break-words text-sm font-semibold text-[var(--accent-dark)] sm:shrink-0 sm:text-right">
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
