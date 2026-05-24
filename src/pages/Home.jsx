import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"
import ShortcutModal from "../components/ShortcutModal"
import CommandSearch from "../components/CommandSearch"

export default function Home({ apps }) {
    const [selectedKeys , setSelectedKeys] = useState([])
    const [search , setSearch] = useState("")
    const [activeApp , setActiveApp] = useState("all")
    const [hoveredShortcut , setHoveredShortcut] = useState(null)
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

            const matchesKeys =
                selectedKeys.length === 0 ||
                selectedKeys.every((key) => shortcut.keys.includes(key))

            const matchesSearch =
                queryWords.length === 0 ||
                matchesShortcutSearch(shortcut , queryWords)

            return matchesApp && matchesKeys && matchesSearch
        })
    } , [allShortcuts , selectedKeys , search , activeApp])

    function handleKeyClick(key) {
        setSelectedKeys((currentKeys) => {
            if (currentKeys.includes(key)) {
                return currentKeys.filter((item) => item !== key)
            }

            return [...currentKeys , key]
        })
    }

    function clearKeys() {
        setSelectedKeys([])
        setHoveredShortcut(null)
    }

    const keyboardKeys = hoveredShortcut?.keys || selectedKeys

    return (
        <main className="h-screen overflow-hidden bg-(--bg)">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px) max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-(--text)">
                                Find Shortcuts
                            </h1>

                            <p className="mt-2 text-(--muted)">
                                Search shortcuts or click keys to build a shortcut visually
                            </p>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search 'cmd p'"
                            className="w-full rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-white/20 focus:bg-white/[0.07] md:w-105"
                        />
                    </div>

                    <div className="mt-5 max-w-full overflow-x-auto pb-2">
                        <div className="flex w-max gap-2">
                            <button
                                onClick={() => setActiveApp("all")}
                                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                                    activeApp === "all"
                                        ? "border-white bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)"
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
                                            ? "border-white bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.22)"
                                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                    }`}
                                >
                                    {app.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                        <HeroKeyboard
                            activeKeys={keyboardKeys}
                            onKeyClick={handleKeyClick}
                        />

                        <PreviewPanel shortcut={hoveredShortcut} />
                    </div>

                    <div className="mt-5 flex min-h-11 flex-wrap items-center gap-2">
                        <span className="text-sm text-(--muted)">
                            Current shortcut :
                        </span>

                        {keyboardKeys.length === 0 ? (
                            <span className="text-sm text-(--muted)">
                                No keys selected
                            </span>
                        ) : (
                            sortShortcutKeys(keyboardKeys).map((key) => (
                                <span
                                    key={key}
                                    className="rounded-full bg-white/6 px-3 py-1 text-sm text-white"
                                >
                                    {formatKey(key)}
                                </span>
                            ))
                        )}

                        {selectedKeys.length > 0 && (
                            <button
                                onClick={clearKeys}
                                className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-sm text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div
                    onMouseLeave={() => setHoveredShortcut(null)}
                    className="mt-3 min-h-0 flex-1 overflow-y-auto px-1 pt-5 pr-2"
                >
                    {results.length === 0 && (
                        <p className="rounded-3xl border border-white/10 bg-white/4 p-6 text-(--muted)">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.map((shortcut) => (
                            <ShortcutCard
                                key={`${shortcut.app}-${shortcut.title}`}
                                shortcut={shortcut}
                                onHover={setHoveredShortcut}
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

function PreviewPanel({ shortcut }) {
    return (
        <div className="mt-4 hidden h-full min-h-62.5 rounded-4xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24) lg:block">
            {shortcut ? (
                <div className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.18)">
                            {shortcut.app?.[0]}
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                {shortcut.app}
                            </p>

                            <h2 className="text-2xl font-semibold text-white">
                                {shortcut.title}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Description
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {shortcut.description || "No description added yet"}
                        </p>
                    </div>

                    <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Shortcut
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {sortShortcutKeys(shortcut.keys).map((key) => (
                                <span
                                    key={key}
                                    className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-medium text-white"
                                >
                                    {formatKey(key)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full flex-col justify-center">
                    <p className="text-sm text-slate-500">
                        Preview
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-white">
                        Hover a shortcut
                    </h2>

                    <p className="mt-3 text-base leading-7 text-slate-400">
                        Shortcut details will appear here with larger keys and app information
                    </p>
                </div>
            )}
        </div>
    )
}

function ShortcutCard({ shortcut , onHover , onOpen }) {
    return (
        <button
            onMouseEnter={() => onHover(shortcut)}
            onClick={() => onOpen(shortcut)}
            className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-[0_0_34px_rgba(255,255,255,0.16),0_18px_45px_rgba(0,0,0,0.30)"
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