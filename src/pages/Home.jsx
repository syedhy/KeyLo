import { useMemo , useState } from "react"

import AppFilter from "../components/AppFilter"
import CommandSearch from "../components/CommandSearch"
import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import {
    formatKey ,
    getQueryWords ,
    getShortcutsFromApps ,
    matchesShortcutSearch ,
    sortShortcutKeys
} from "../utils/shortcuts"

export default function Home({ apps }) {
    const [selectedKeys , setSelectedKeys] = useState([])
    const [search , setSearch] = useState("")
    const [activeApp , setActiveApp] = useState("all")
    const [hoveredShortcut , setHoveredShortcut] = useState(null)
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const allShortcuts = useMemo(() => getShortcutsFromApps(apps) , [apps])

    const results = useMemo(() => {
        const queryWords = getQueryWords(search)

        return allShortcuts.filter((shortcut) => {
            const matchesApp =
                activeApp === "all" || shortcut.appId === activeApp

            const matchesKeys =
                selectedKeys.length === 0 ||
                selectedKeys.every((key) =>
                    (shortcut.keys || []).map(formatKey).includes(formatKey(key))
                )

            return matchesApp && matchesKeys && matchesShortcutSearch(shortcut , queryWords)
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
        <PageShell centerContent className="home-page">
            <div className="home-landing w-full lg:my-auto">
                <div className="home-heading-row flex justify-center">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search 'cmd p'"
                        className="w-full rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-white/20 focus:bg-white/[0.07] md:max-w-3xl"
                    />
                </div>

                <AppFilter
                    apps={apps}
                    activeApp={activeApp}
                    onChange={setActiveApp}
                    className="home-filter"
                />

                <div className="home-feature-grid grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <HeroKeyboard
                        activeKeys={keyboardKeys}
                        density="home"
                        onKeyClick={handleKeyClick}
                    />

                    <PreviewPanel shortcut={hoveredShortcut} />
                </div>

                <div className="home-current flex min-h-11 flex-wrap items-center gap-2">
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
                            type="button"
                            onClick={clearKeys}
                            className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-sm text-white"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div
                    onMouseLeave={() => setHoveredShortcut(null)}
                    className="home-results"
                >
                    {results.length === 0 && (
                        <p className="rounded-3xl border border-white/10 bg-white/4 p-6 text-(--muted)">
                            No shortcuts found
                        </p>
                    )}

                    <div className="home-result-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </div>

            <ShortcutModal
                shortcut={openedShortcut}
                onClose={() => setOpenedShortcut(null)}
            />

            <CommandSearch
                shortcuts={allShortcuts}
                onSelect={setOpenedShortcut}
            />
        </PageShell>
    )
}

function PreviewPanel({ shortcut }) {
    return (
        <div className="home-preview-panel hidden min-h-[15.5rem] rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:block">
            {shortcut ? (
                <div className="flex h-full flex-col">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.18)]">
                            {shortcut.app?.[0]}
                        </div>

                        <div className="min-w-0">
                            <p className="break-words text-sm text-slate-400">
                                {shortcut.app}
                            </p>

                            <h2 className="break-words text-2xl font-semibold text-white">
                                {shortcut.title}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-xs uppercase text-slate-500">
                            Description
                        </p>

                        <p className="mt-3 break-words text-sm leading-6 text-slate-300">
                            {shortcut.description || "No description added yet"}
                        </p>
                    </div>

                    <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-xs uppercase text-slate-500">
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
