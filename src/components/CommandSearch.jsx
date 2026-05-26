import { useEffect , useMemo , useRef , useState } from "react"

import {
    formatShortcut ,
    getQueryWords ,
    matchesShortcutSearch
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
        const queryWords = getQueryWords(query)

        if (queryWords.length === 0) {
            return shortcuts.slice(0 , 8)
        }

        return shortcuts
            .filter((shortcut) => matchesShortcutSearch(shortcut , queryWords))
            .slice(0 , 10)
    } , [query , shortcuts])

    if (!open) return null

    return (
        <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 px-4 py-4 backdrop-blur-xl sm:pt-24"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[calc(100vh_-_2rem)] max-h-[calc(100dvh_-_2rem)] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-(--border) bg-(--surface) shadow-(--shadow)"
            >
                <input
                    ref={inputRef}
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search cmd p , new f , vs code cmd shift e..."
                    className="w-full border-b border-(--border) bg-transparent px-5 py-4 text-base text-(--text) outline-none placeholder:text-(--muted) sm:px-6 sm:py-5 sm:text-lg"
                />

                <div className="max-h-[calc(100vh_-_10rem)] max-h-[calc(100dvh_-_10rem)] overflow-y-auto p-3">
                    {results.map((shortcut) => (
                        <button
                            type="button"
                            key={`${shortcut.app}-${shortcut.title}`}
                            onClick={() => {
                                onSelect(shortcut)
                                setOpen(false)
                                setQuery("")
                            }}
                            className="w-full rounded-2xl p-4 text-left transition-colors hover:bg-(--surface-soft)"
                        >
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-(--muted)">
                                        {shortcut.app}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-(--text)">
                                        {shortcut.title}
                                    </p>

                                    <p className="mt-1 break-words text-xs text-(--muted)">
                                        {shortcut.description || "No description added yet"}
                                    </p>
                                </div>

                                <p className="break-words text-sm text-(--accent) sm:shrink-0 sm:text-right">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </div>
                        </button>
                    ))}

                    {results.length === 0 && (
                        <p className="p-6 text-sm text-(--muted)">
                            No shortcuts found
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
