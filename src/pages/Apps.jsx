import { useMemo , useState } from "react"

import AppFilter from "../components/AppFilter"
import CommandSearch from "../components/CommandSearch"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import {
    getQueryWords ,
    getShortcutsFromApps ,
    matchesShortcutSearch
} from "../utils/shortcuts"

export default function Apps({ apps }) {
    const [activeApp , setActiveApp] = useState("all")
    const [search , setSearch] = useState("")
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const allShortcuts = useMemo(() => getShortcutsFromApps(apps) , [apps])

    const results = useMemo(() => {
        const queryWords = getQueryWords(search)

        return allShortcuts.filter((shortcut) => {
            const matchesApp =
                activeApp === "all" || shortcut.appId === activeApp

            return matchesApp && matchesShortcutSearch(shortcut , queryWords)
        })
    } , [allShortcuts , activeApp , search])

    return (
        <PageShell className="gap-4">
            <div className="pt-4 sm:pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-(--text) sm:text-4xl">
                            List Shortcuts
                        </h1>

                        <p className="mt-2 text-sm text-(--muted) sm:text-base">
                            Browse all shortcuts without the keyboard
                        </p>
                    </div>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search 'command palette'"
                        className="w-full rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-white/20 focus:bg-white/[0.07] md:max-w-md"
                    />
                </div>

                <AppFilter
                    apps={apps}
                    activeApp={activeApp}
                    onChange={setActiveApp}
                    className="mt-6"
                />
            </div>

            <div className="pb-4 pt-2">
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
                            onOpen={setOpenedShortcut}
                        />
                    ))}
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
