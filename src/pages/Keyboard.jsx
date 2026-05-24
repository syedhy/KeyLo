import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"
import { apps } from "../data/sampleApps"

export default function Keyboard() {
    const [selectedKeys , setSelectedKeys] = useState([])

    const allShortcuts = useMemo(() => {
        return apps.flatMap((app) =>
            app.shortcuts.map((shortcut) => ({
                ...shortcut ,
                app : app.name ,
                appId : app.id
            }))
        )
    } , [])

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
        <main className="h-screen overflow-hidden bg-(--bg)">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-(--text)">
                                Shortcut Builder
                            </h1>

                            <p className="mt-2 text-(--muted)">
                                Click keys to build a shortcut and find matching commands
                            </p>
                        </div>

                        <button
                            onClick={clearKeys}
                            className="w-fit rounded-full border border-(--border) bg-(--surface) px-5 py-3 text-sm text-(--text) transition-colors hover:bg-(--surface-soft)"
                        >
                            Clear keys
                        </button>
                    </div>

                    <HeroKeyboard
                        activeKeys={selectedKeys}
                        onKeyClick={handleKeyClick}
                    />

                    <div className="mt-5 flex flex-wrap items-center gap-2">
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
                </div>

                <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
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

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {matchingShortcuts.map((shortcut) => (
                            <div
                                key={`${shortcut.app}-${shortcut.title}`}
                                className="rounded-3xl border border-(--border) bg-(--surface) p-5"
                            >
                                <p className="text-xs text-(--muted)">
                                    {shortcut.app}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-(--text)">
                                    {shortcut.title}
                                </p>

                                <p className="mt-3 text-sm text-(--accent-dark)">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

function formatKey(key) {
    const labels = {
        CmdLeft : "Cmd" ,
        CmdRight : "Cmd" ,
        OptionLeft : "Option" ,
        OptionRight : "Option" ,
        ShiftLeft : "Shift" ,
        ShiftRight : "Shift" ,
        ControlLeft : "Control" ,
        ControlRight : "Control"
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