import { useMemo, useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import AppFilter from "../components/AppFilter"
import CommandSearch from "../components/CommandSearch"
import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import WorkspaceHeader from "../components/WorkspaceHeader"
import {
    formatKey ,
    getShortcutsFromApps ,
    searchShortcuts ,
    sortShortcutKeys
} from "../utils/shortcuts"

export default function Home({ apps }) {
    const [selectedKeys , setSelectedKeys] = useState([])
    const [search , setSearch] = useState("")
    const [activeApp , setActiveApp] = useState("all")
    const [hoveredShortcut , setHoveredShortcut] = useState(null)
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const allShortcuts = useMemo(() => getShortcutsFromApps(apps) , [apps])

    const scopedShortcuts = useMemo(() => {
        return allShortcuts.filter((shortcut) => {
            const matchesApp =
                activeApp === "all" || shortcut.appId === activeApp

            const matchesKeys =
                selectedKeys.length === 0 ||
                selectedKeys.every((key) =>
                    (shortcut.keys || []).map(formatKey).includes(formatKey(key))
                )

            return matchesApp && matchesKeys
        })
    } , [allShortcuts , activeApp , selectedKeys])

    const results = useMemo(() => {
        return searchShortcuts(scopedShortcuts , search)
    } , [scopedShortcuts , search])

    function handleKeyClick(key) {
        setSelectedKeys((currentKeys) => {
            if (currentKeys.includes(key)) {
                return currentKeys.filter((item) => item !== key)
            }

            return [...currentKeys , key]
        })
    }

    const keyboardKeys = hoveredShortcut?.keys || selectedKeys

    const container = useRef(null)

    useGSAP(() => {
        gsap.fromTo(".shortcut-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
        )
        gsap.fromTo(".home-preview-panel", 
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out", overwrite: "auto" }
        )
    }, { scope: container, dependencies: [results, hoveredShortcut] })

    return (
        <PageShell centerContent className="home-page">
            <div ref={container} className="workspace-layout home-layout flex w-full flex-col gap-[clamp(0.2rem,0.45vh,0.5rem)]">
                <WorkspaceHeader
                    eyebrow="Overview"
                    title="Search shortcuts without the clutter"
                    description="The desktop view keeps the keyboard explorer, while mobile stays lighter with search, filters, and ranked results."
                    stats={[
                        {
                            label : "apps" ,
                            value : apps.length
                        } ,
                        {
                            label : "shortcuts" ,
                            value : allShortcuts.length
                        }
                    ]}
                    actions={
                        <div className="workspace-header__actions-card w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--paper)] p-2.5 shadow-[0_12px_30px_rgba(20,25,34,0.05)] sm:p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                                    Search
                                </p>

                                <kbd className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)] sm:inline-flex">
                                    Cmd K
                                </kbd>
                            </div>

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Cmd P, focus search, duplicate line..."
                                className="mt-2.5 w-full rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                            />
                        </div>
                    }
                />

                <AppFilter
                    apps={apps}
                    activeApp={activeApp}
                    onChange={setActiveApp}
                />

                <div className="grid items-start gap-2.5 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <div className="hidden md:block">
                        <HeroKeyboard
                            activeKeys={keyboardKeys}
                            density="home"
                            onKeyClick={handleKeyClick}
                        />
                    </div>

                    <PreviewPanel shortcut={hoveredShortcut} />
                </div>

                <p className="workspace-header__compact-hide hidden min-h-8 items-center text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)] md:flex">
                    Shortcuts
                </p>

                <div
                    onMouseLeave={() => setHoveredShortcut(null)}
                    className="space-y-3"
                >
                    {results.length === 0 && (
                        <p className="doodle-panel p-5 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
        <div className="home-preview-panel doodle-panel hidden min-h-[14rem] p-4 lg:block lg:h-[20rem] lg:overflow-hidden">
            {shortcut ? (
                <div className="flex h-full min-h-0 flex-col">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-lg font-bold text-[var(--accent-dark)] shadow-[0_10px_20px_rgba(20,25,34,0.05)]">
                            {shortcut.app?.[0]}
                        </div>

                        <div className="min-w-0">
                            <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                                {shortcut.app}
                            </p>

                            <h2 className="break-words text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text)]">
                                {shortcut.title}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Description
                        </p>

                        <p className="mt-2.5 break-words text-sm leading-6 text-[var(--muted)]">
                            {shortcut.description || "No description added yet"}
                        </p>
                    </div>

                    <div className="mt-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                            Shortcut
                        </p>

                        <div className="mt-2.5 flex flex-wrap gap-2">
                            {sortShortcutKeys(shortcut.keys).map((key) => (
                                <span
                                    key={key}
                                    className="rounded-full border border-[var(--border)] bg-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--text)]"
                                >
                                    {formatKey(key)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                        Preview
                    </p>

                    <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text)]">
                        Hover a shortcut
                    </h2>

                    <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                        Shortcut details appear here with larger keys and app information.
                    </p>
                </div>
            )}
        </div>
    )
}
