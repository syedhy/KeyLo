import { useMemo , useState } from "react"
import { Link , useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"
import ShortcutModal from "../components/ShortcutModal"
import CommandSearch from "../components/CommandSearch"

export default function AppShortcuts({ apps }) {
    const { appId } = useParams()

    const app = apps.find((item) => item.id === appId) || apps[0]

    const shortcuts = useMemo(() => {
        return app.shortcuts.map((shortcut) => ({
            ...shortcut ,
            app : app.name ,
            appId : app.id
        }))
    } , [app])

    const [selectedShortcut , setSelectedShortcut] = useState(null)
    const [search , setSearch] = useState("")
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const filteredShortcuts = useMemo(() => {
        const queryWords = normalizeSearch(search).split(" ").filter(Boolean)

        return shortcuts.filter((shortcut) => {

            return (
                queryWords.length === 0 ||
                matchesShortcutSearch(shortcut, queryWords)
            )
        })
    } , [shortcuts , search])

    return (
        <main className="h-screen overflow-hidden bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <Link
                        to="/apps"
                        className="text-sm text-[var(--muted)]"
                    >
                        ← Back to apps
                    </Link>

                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-[var(--text)]">
                                {app.name}
                            </h1>

                            <p className="mt-2 text-[var(--muted)]">
                                Search shortcuts and hover any card to highlight keys
                            </p>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search cmd p , cmd shift p..."
                            className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm outline-none md:w-80"
                        />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        <HeroKeyboard
                            activeKeys={selectedShortcut?.keys || []}
                        />

                        <div className="mt-10 hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 lg:block">
                            <p className="text-xs text-[var(--muted)]">
                                Preview
                            </p>

                            {selectedShortcut ? (
                                <>
                                    <p className="mt-3 text-sm text-[var(--muted)]">
                                        {selectedShortcut.app}
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
                                        {selectedShortcut.title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                                        {selectedShortcut.description || "No description added yet"}
                                    </p>

                                    <p className="mt-4 text-sm font-semibold text-[var(--accent-dark)]">
                                        {formatShortcut(selectedShortcut.keys)}
                                    </p>
                                </>
                            ) : (
                                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                                    Hover a shortcut card to preview its details here
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    onMouseLeave={() => setSelectedShortcut(null)}
                    className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2"
                >
                    {filteredShortcuts.length === 0 && (
                        <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredShortcuts.map((shortcut) => (
                            <button
                                key={`${shortcut.app}-${shortcut.title}`}
                                onMouseEnter={() => setSelectedShortcut(shortcut)}
                                onClick={() => setOpenedShortcut(shortcut)}
                                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all hover:shadow-lg"
                            >
                                <p className="text-xs text-[var(--muted)]">
                                    {shortcut.app}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                                    {shortcut.title}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                                    {shortcut.description || "No description added yet"}
                                </p>

                                <p className="mt-3 text-sm text-[var(--accent-dark)]">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <ShortcutModal
                shortcut={openedShortcut}
                onClose={() => setOpenedShortcut(null)}
            />

            <CommandSearch
                shortcuts={shortcuts}
                onSelect={setOpenedShortcut}
            />
        </main>
    )
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
        .replaceAll(/\s+/g , " ")
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
    return sortShortcutKeys(keys).map(formatKey).join(" + ")
}

function sortShortcutKeys(keys) {
    const order = {
        ControlLeft : 1 ,
        ControlRight : 1 ,
        OptionLeft : 2 ,
        OptionRight : 2 ,
        CmdLeft : 3 ,
        CmdRight : 3 ,
        ShiftLeft : 4 ,
        ShiftRight : 4
    }

    return [...keys].sort((a , b) => {
        const aOrder = order[a] || 10
        const bOrder = order[b] || 10

        if (aOrder !== bOrder) return aOrder - bOrder

        return a.localeCompare(b)
    })
}
function matchesShortcutSearch(shortcut , queryWords) {
    const searchableText = getSearchText(shortcut)

    const keyWords = ["cmd" , "shift" , "ctrl" , "control" , "option" , "alt"]

    const shortcutWords = formatShortcut(shortcut.keys)
        .toLowerCase()
        .replaceAll("command" , "cmd")
        .replaceAll("control" , "ctrl")
        .replaceAll("option" , "alt")
        .replaceAll("+" , " ")
        .split(" ")
        .filter(Boolean)

    return queryWords.every((word) => {
        if (keyWords.includes(word) || word.length === 1) {
            return shortcutWords.includes(word)
        }

        return searchableText.includes(word)
    })
}