import { useMemo, useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Link , useParams } from "react-router-dom"

import CommandSearch from "../components/CommandSearch"
import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import WorkspaceHeader from "../components/WorkspaceHeader"
import {
    formatShortcut ,
    searchShortcuts
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
        return searchShortcuts(shortcuts , search)
    } , [shortcuts , search])

    const container = useRef(null)

    useGSAP(() => {
        gsap.fromTo(".shortcut-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
        )
        gsap.fromTo(".detail-preview-panel", 
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out", overwrite: "auto" }
        )
    }, { scope: container, dependencies: [filteredShortcuts, selectedShortcut] })

    return (
        <PageShell centerContent className="detail-page">
            <div ref={container} className="workspace-layout detail-layout flex w-full flex-col gap-[clamp(0.75rem,1.5vh,1.2rem)]">
                <Link
                    to="/apps"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--muted)] shadow-[0_10px_24px_rgba(20,25,34,0.05)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                >
                    ← Back to apps
                </Link>

                <WorkspaceHeader
                    eyebrow="App detail"
                    title={app?.name || "Shortcuts"}
                    description="Search within one app, hover cards for the desktop preview, and open any shortcut in the modal."
                    stats={[
                        {
                            label : "shortcuts" ,
                            value : shortcuts.length
                        } ,
                        {
                            label : "search results" ,
                            value : filteredShortcuts.length
                        }
                    ]}
                    actions={
                        <div className="workspace-header__actions-card w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--paper)] p-4 shadow-[0_12px_30px_rgba(20,25,34,0.05)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                                Search
                            </p>

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search cmd p, duplicate line..."
                                className="mt-3 w-full rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                            />
                        </div>
                    }
                />

                <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="hidden md:block">
                        <HeroKeyboard
                            activeKeys={selectedShortcut?.keys || []}
                            density="detail"
                        />
                    </div>

                    <PreviewPanel shortcut={selectedShortcut} />
                </div>

                <div
                    onMouseLeave={() => setSelectedShortcut(null)}
                    className="space-y-4"
                >
                    {filteredShortcuts.length === 0 && (
                        <p className="doodle-panel p-5 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
        <div className="detail-preview-panel doodle-panel hidden min-h-[15rem] p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Preview
            </p>

            {shortcut ? (
                <>
                    <p className="mt-3 break-words text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
                        {shortcut.app}
                    </p>

                    <h2 className="mt-1 break-words text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text)]">
                        {shortcut.title}
                    </h2>

                    <p className="mt-3 break-words text-sm leading-7 text-[var(--muted)]">
                        {shortcut.description || "No description added yet"}
                    </p>

                    <p className="mt-4 break-words text-sm font-semibold text-[var(--accent-dark)]">
                        {formatShortcut(shortcut.keys)}
                    </p>
                </>
            ) : (
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    Hover a shortcut card to preview its details here.
                </p>
            )}
        </div>
    )
}
