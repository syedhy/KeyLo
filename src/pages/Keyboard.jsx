import { useMemo , useState } from "react"

import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import {
    formatKey ,
    formatShortcut ,
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
            selectedKeys.every((key) => shortcut.keys.includes(key))
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
            <div className="builder-landing w-full lg:my-auto">
                <div className="builder-heading-row flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-(--text) sm:text-4xl">
                            Shortcut Builder
                        </h1>

                        <p className="mt-2 text-sm text-(--muted) sm:text-base">
                            Click keys to build a shortcut and find matching commands
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={clearKeys}
                        className="w-fit rounded-full border border-(--border) bg-(--surface) px-5 py-3 text-sm text-(--text) transition-colors hover:bg-(--surface-soft)"
                    >
                        Clear keys
                    </button>
                </div>

                <HeroKeyboard
                    activeKeys={selectedKeys}
                    density="detail"
                    onKeyClick={handleKeyClick}
                />

                <div className="builder-current flex flex-wrap items-center gap-2">
                    <span className="text-sm text-(--muted)">
                        Current shortcut :
                    </span>

                    {selectedKeys.length === 0 ? (
                        <span className="text-sm text-(--muted)">
                            No keys selected
                        </span>
                    ) : (
                        sortShortcutKeys(selectedKeys).map((key) => (
                            <span
                                key={key}
                                className="rounded-full bg-(--surface) px-3 py-1 text-sm text-(--accent-dark)"
                            >
                                {formatKey(key)}
                            </span>
                        ))
                    )}
                </div>

                <div className="builder-results">
                    {selectedKeys.length === 0 && (
                        <p className="rounded-3xl border border-(--border) bg-(--surface) p-6 text-(--muted)">
                            Click keys on the keyboard to start searching
                        </p>
                    )}

                    {selectedKeys.length > 0 && matchingShortcuts.length === 0 && (
                        <p className="rounded-3xl border border-(--border) bg-(--surface) p-6 text-(--muted)">
                            No shortcuts found for this key combination
                        </p>
                    )}

                    <div className="builder-result-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {matchingShortcuts.map((shortcut) => (
                            <div
                                key={`${shortcut.app}-${shortcut.title}`}
                                className="rounded-3xl border border-(--border) bg-(--surface) p-5"
                            >
                                <p className="text-xs text-(--muted)">
                                    {shortcut.app}
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold text-(--text)">
                                    {shortcut.title}
                                </p>

                                <p className="mt-3 break-words text-sm text-(--accent-dark)">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    )
}
