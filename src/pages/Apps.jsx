import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"
import ShortcutModal from "../components/ShortcutModal"
import CommandSearch from "../components/CommandSearch"

export default function Apps({ apps }) {
    const [activeApp , setActiveApp] = useState("all")
    const [search , setSearch] = useState("")
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const allShortcuts = useMemo(() => {
        return apps.flatMap((app) =>
            app.shortcuts.map((shortcut) => ({
                ...shortcut ,
                app : app.name ,
                appId : app.id
            }))
        )
    } , [apps])

    const results = useMemo(() => {
        const queryWords = normalizeSearch(search).split(" ").filter(Boolean)

        return allShortcuts.filter((shortcut) => {
            const matchesApp =
                activeApp === "all" || shortcut.appId === activeApp

            const matchesSearch =
                queryWords.length === 0 ||
                matchesShortcutSearch(shortcut , queryWords)

            return matchesApp && matchesSearch
        })
    } , [allShortcuts , activeApp , search])

    return (
        <main className="h-screen overflow-hidden bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-[var(--text)]">
                                List Shortcuts
                            </h1>

                            <p className="mt-2 text-[var(--muted)]">
                                Browse all shortcuts without the keyboard
                            </p>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search 'command palette'" 
                            className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-white/20 focus:bg-white/[0.07] md:w-[420px]"
                        />
                    </div>

                    <div className="mt-6 max-w-full overflow-x-auto pb-2">
                        <div className="flex w-max gap-2">
                            <button
                                onClick={() => setActiveApp("all")}
                                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                                    activeApp === "all"
                                        ? "border-white bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]"
                                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                }`}
                            >
                                All
                            </button>

                            {apps.map((app) => (
                                <button
                                    key={app.id}
                                    onClick={() => setActiveApp(app.id)}
                                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                                        activeApp === app.id
                                            ? "border-white bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)]"
                                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                    }`}
                                >
                                    {app.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-1 pt-5 pr-2">
                    {results.length === 0 && (
                        <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.map((shortcut) => (
                            <ShortcutCard
                                key={`${shortcut.app}-${shortcut.title}`}
                                shortcut={shortcut}
                                onOpen={setOpenedShortcut}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <ShortcutModal
                shortcut={openedShortcut}
                onClose={() => setOpenedShortcut(null)}
            />

            <CommandSearch
                shortcuts={allShortcuts}
                onSelect={setOpenedShortcut}
            />
        </main>
    )
}

function ShortcutCard({ shortcut , onOpen }) {
    return (
        <button
            onClick={() => onOpen(shortcut)}
            className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-[0_0_34px_rgba(255,255,255,0.16),0_18px_45px_rgba(0,0,0,0.30)]"
        >
            <p className="text-xs font-medium text-slate-400">
                {shortcut.app}
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
                {shortcut.title}
            </p>

            <p className="mt-4 text-sm font-medium text-slate-200">
                {formatShortcut(shortcut.keys)}
            </p>
        </button>
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
        ControlLeft : "Ctrl" ,
        ControlRight : "Ctrl"
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