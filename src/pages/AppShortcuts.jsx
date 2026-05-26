import { useMemo , useState } from "react"
import { Link , useParams } from "react-router-dom"

import CommandSearch from "../components/CommandSearch"
import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import {
    formatShortcut ,
    getQueryWords ,
    matchesShortcutSearch
} from "../utils/shortcuts"

export default function AppShortcuts({ apps }) {
    const { appId } = useParams()

    const app = apps.find((item) => item.id === appId) || apps[0]

    const shortcuts = useMemo(() => {
        if (!app) return []

        return (app.shortcuts || []).map((shortcut) => ({
            ...shortcut ,
            app : app.name ,
            appId : app.id
        }))
    } , [app])

    const [selectedShortcut , setSelectedShortcut] = useState(null)
    const [search , setSearch] = useState("")
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const filteredShortcuts = useMemo(() => {
        const queryWords = getQueryWords(search)

        return shortcuts.filter((shortcut) =>
            matchesShortcutSearch(shortcut , queryWords)
        )
    } , [shortcuts , search])

    return (
        <PageShell centerContent className="detail-page">
            <div className="detail-landing w-full lg:my-auto">
                <Link
                    to="/apps"
                    className="detail-back text-sm text-(--muted) transition hover:text-white"
                >
                    ← Back to apps
                </Link>

                <div className="detail-heading-row flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="break-words text-3xl font-semibold text-(--text) sm:text-4xl">
                            {app?.name || "Shortcuts"}
                        </h1>

                        <p className="mt-2 text-sm text-(--muted) sm:text-base">
                            Search shortcuts and hover any card to highlight keys
                        </p>
                    </div>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search cmd p"
                        className="w-full rounded-full border border-(--border) bg-(--surface) px-5 py-3 text-sm outline-none transition focus:border-white/20 md:max-w-sm"
                    />
                </div>

                <div className="detail-feature-grid grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <HeroKeyboard
                        activeKeys={selectedShortcut?.keys || []}
                        density="detail"
                    />

                    <PreviewPanel shortcut={selectedShortcut} />
                </div>

                <div
                    onMouseLeave={() => setSelectedShortcut(null)}
                    className="detail-results"
                >
                    {filteredShortcuts.length === 0 && (
                        <p className="rounded-3xl border border-(--border) bg-(--surface) p-6 text-(--muted)">
                            No shortcuts found
                        </p>
                    )}

                    <div className="detail-result-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredShortcuts.map((shortcut) => (
                            <ShortcutCard
                                key={`${shortcut.app}-${shortcut.title}`}
                                shortcut={shortcut}
                                onHover={setSelectedShortcut}
                                onOpen={setOpenedShortcut}
                                showDescription
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
                shortcuts={shortcuts}
                onSelect={setOpenedShortcut}
            />
        </PageShell>
    )
}

function PreviewPanel({ shortcut }) {
    return (
        <div className="detail-preview-panel hidden min-h-[15.5rem] rounded-[2rem] border border-(--border) bg-(--surface) p-5 lg:block">
            <p className="text-xs text-(--muted)">
                Preview
            </p>

            {shortcut ? (
                <>
                    <p className="mt-3 break-words text-sm text-(--muted)">
                        {shortcut.app}
                    </p>

                    <h2 className="mt-1 break-words text-xl font-semibold text-(--text)">
                        {shortcut.title}
                    </h2>

                    <p className="mt-3 break-words text-sm leading-6 text-(--muted)">
                        {shortcut.description || "No description added yet"}
                    </p>

                    <p className="mt-4 break-words text-sm font-semibold text-(--accent-dark)">
                        {formatShortcut(shortcut.keys)}
                    </p>
                </>
            ) : (
                <p className="mt-3 text-sm leading-6 text-(--muted)">
                    Hover a shortcut card to preview its details here
                </p>
            )}
        </div>
    )
}
