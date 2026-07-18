import { useMemo, useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import AppFilter from "../components/AppFilter"
import CommandSearch from "../components/CommandSearch"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import ShortcutModal from "../components/ShortcutModal"
import WorkspaceHeader from "../components/WorkspaceHeader"
import {
    getShortcutsFromApps ,
    searchShortcuts
} from "../utils/shortcuts"

export default function Apps({ apps }) {
    const [activeApp , setActiveApp] = useState("all")
    const [search , setSearch] = useState("")
    const [openedShortcut , setOpenedShortcut] = useState(null)

    const allShortcuts = useMemo(() => getShortcutsFromApps(apps) , [apps])

    const scopedShortcuts = useMemo(() => {
        return allShortcuts.filter((shortcut) => {
            return activeApp === "all" || shortcut.appId === activeApp
        })
    } , [allShortcuts , activeApp])

    const results = useMemo(() => {
        return searchShortcuts(scopedShortcuts , search)
    } , [scopedShortcuts , search])

    const container = useRef(null)

    useGSAP(() => {
        gsap.fromTo(".shortcut-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
        )
    }, { scope: container, dependencies: [results] })

    return (
        <PageShell className="gap-[clamp(0.75rem,1.5vh,1.2rem)]">
            <div ref={container} className="workspace-layout flex w-full flex-col gap-[clamp(0.75rem,1.5vh,1.2rem)]">
                <WorkspaceHeader
                    eyebrow="Browse"
                    title="Every shortcut in one calm list"
                    description="This page skips the keyboard view entirely and keeps search, filters, and ranked results front and center."
                    stats={[
                        {
                            label : "apps" ,
                            value : apps.length
                        } ,
                        {
                            label : "shortcuts" ,
                            value : scopedShortcuts.length
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
                                placeholder="Search command palette, duplicate line..."
                                className="mt-3 w-full rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                            />
                        </div>
                    }
                />

                <AppFilter
                    apps={apps}
                    activeApp={activeApp}
                    onChange={setActiveApp}
                />

                <div className="space-y-4">
                    {results.length === 0 && (
                        <p className="doodle-panel p-5 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
            </div>
        </PageShell>
    )
}
