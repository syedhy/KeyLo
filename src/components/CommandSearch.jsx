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
        const queryWords = normalizeSearch(query)
            .split(" ")
            .filter(Boolean)

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
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-xl"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl overflow-hidden rounded-4xl border border-(--border) bg-(--surface) shadow-(--shadow)"
            >
                <input
                    autoFocuS
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search cmd p , new f , vs code cmd shift e..."
                    className="w-full border-b border-(--border) bg-transparent px-6 py-5 text-lg text-(--text) outline-none placeholder:text-(--muted)"
                />

                <div className="max-h-105 overflow-y-auto p-3">
                    {results.map((shortcut) => (
                        <button
                            key={`${shortcut.app}-${shortcut.title}`}
                            onClick={() => {
                                onSelect(shortcut)
                                setOpen(false)
                                setQuery("")
                            }}
                            className="w-full rounded-2xl p-4 text-left transition-colors hover:bg-(--surface-soft)"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-(--muted)">
                                        {shortcut.app}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-(--text)">
                                        {shortcut.title}
                                    </p>

                                    <p className="mt-1 text-xs text-(--muted)">
                                        {shortcut.description || "No description added yet"}
                                    </p>
                                </div>

                                <p className="shrink-0 text-sm text-(--accent)">
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

function matchesShortcutSearch(shortcut , queryWords) {
    const searchableText = getSearchText(shortcut)

    const modifierWords = ["cmd" , "shift" , "ctrl" , "control" , "option" , "alt"]

    const queryHasModifier =
        queryWords.some((word) => modifierWords.includes(word))

    const shortcutWords = formatShortcut(shortcut.keys)
        .toLowerCase()
        .replaceAll("command" , "cmd")
        .replaceAll("control" , "ctrl")
        .replaceAll("option" , "alt")
        .replaceAll("+" , " ")
        .split(" ")
        .filter(Boolean)

    return queryWords.every((word) => {
        if (modifierWords.includes(word)) {
            return shortcutWords.includes(word)
        }

        if (queryHasModifier && word.length === 1) {
            return shortcutWords.includes(word)
        }

        return searchableText.includes(word)
    })
}

function normalizeSearch(text) {
    return text
        .toLowerCase()
        .replaceAll("command" , "cmd")
        .replaceAll("control" , "ctrl")
        .replaceAll("option" , "alt")
        .replaceAll("+" , " ")
        .replaceAll("-" , " ")
        .replaceAll("," , " ")
        .replace(/\s+/g , " ")
        .trim()
}

function getSearchText(shortcut) {
    const readableKeys = formatShortcut(shortcut.keys)
    const compactKeys = readableKeys.replaceAll(" + " , " ")

    return normalizeSearch(`
        ${shortcut.app}
        ${shortcut.title}
        ${shortcut.description || ""}
        ${shortcut.keys.map(formatKey).join(" ")}
        ${readableKeys}
        ${compactKeys}
    `)
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