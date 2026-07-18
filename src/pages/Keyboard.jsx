import { useMemo , useState } from "react"

import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import ShortcutCard from "../components/ShortcutCard"
import WorkspaceHeader from "../components/WorkspaceHeader"
import {
    formatKey ,
    getShortcutsFromApps ,
    sortShortcutKeys
} from "../utils/shortcuts"

export default function Keyboard({ apps = [] }) {
    const [selectedKeys , setSelectedKeys] = useState([])

    const allShortcuts = useMemo(() => getShortcutsFromApps(apps) , [apps])

    const matchingShortcuts = useMemo(() => {
        if (selectedKeys.length === 0) {
            return []
        }

        return allShortcuts.filter((shortcut) =>
            selectedKeys.every((key) => (shortcut.keys || []).includes(key))
        )
    } , [allShortcuts , selectedKeys])

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
    }

    return (
        <PageShell centerContent className="builder-page">
            <div className="workspace-layout builder-layout flex w-full flex-col gap-[clamp(0.75rem,1.5vh,1.2rem)]">
                <WorkspaceHeader
                    eyebrow="Builder"
                    title="Use the keyboard to shape a shortcut"
                    description="This page stays as a simple key-combination builder for desktop, with a calmer, more readable layout."
                    stats={[
                        {
                            label : "selected keys" ,
                            value : selectedKeys.length
                        } ,
                        {
                            label : "matches" ,
                            value : matchingShortcuts.length
                        }
                    ]}
                    actions={
                        <button
                            type="button"
                            onClick={clearKeys}
                            className="w-full rounded-full border border-[var(--border)] bg-[var(--paper)] px-5 py-3 text-sm font-semibold text-[var(--text)] shadow-[0_10px_24px_rgba(20,25,34,0.05)] transition hover:bg-[var(--surface-soft)]"
                        >
                            Clear keys
                        </button>
                    }
                />

                <HeroKeyboard
                    activeKeys={selectedKeys}
                    density="detail"
                    onKeyClick={handleKeyClick}
                />

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-[var(--muted)]">
                        Current shortcut:
                    </span>

                    {selectedKeys.length === 0 ? (
                        <span className="text-sm text-[var(--muted)]">
                            No keys selected
                        </span>
                    ) : (
                        sortShortcutKeys(selectedKeys).map((key) => (
                            <span
                                key={key}
                                className="rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-1 text-sm font-medium text-[var(--text)]"
                            >
                                {formatKey(key)}
                            </span>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    {selectedKeys.length === 0 && (
                        <p className="doodle-panel p-5 text-[var(--muted)]">
                            Click keys on the keyboard to start searching
                        </p>
                    )}

                    {selectedKeys.length > 0 && matchingShortcuts.length === 0 && (
                        <p className="doodle-panel p-5 text-[var(--muted)]">
                            No shortcuts found for this key combination
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {matchingShortcuts.map((shortcut) => (
                            <ShortcutCard
                                key={`${shortcut.app}-${shortcut.title}`}
                                shortcut={shortcut}
                                showDescription
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    )
}
