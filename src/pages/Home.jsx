import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"
import ShortcutModal from "../components/ShortcutModal"
import CommandSearch from "../components/CommandSearch"

export default function Home({ apps }) {
    const [selectedKeys , setSelectedKeys] = useState([])
    const [search , setSearch] = useState("")
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
    } , [])

    const results = useMemo(() => {
        const query = search.toLowerCase().trim()

        return allShortcuts.filter((shortcut) => {
            const matchesKeys =
                selectedKeys.length === 0 ||
                selectedKeys.every((key) => shortcut.keys.includes(key))

            const searchableText =
                `${shortcut.app} ${shortcut.title} ${shortcut.description || ""} ${shortcut.keys.join(" ")} ${formatShortcut(shortcut.keys)}`
                    .toLowerCase()

            const matchesSearch =
                query === "" || searchableText.includes(query)

            return matchesKeys && matchesSearch
        })
    }, [allShortcuts, selectedKeys, search])

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

    const keyboardKeys =
        hoveredShortcut?.keys || selectedKeys

    return (
        <main className="h-screen overflow-hidden bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-[var(--text)]">
                                Find Shortcuts
                            </h1>

                            <p className="mt-2 text-[var(--muted)]">
                                Search shortcuts or click keys to build a shortcut visually
                            </p>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search cmd p , chrome tab , command palette..."
                            className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm outline-none md:w-[420px]"
                        />
                    </div>

                    <HeroKeyboard
                        activeKeys={keyboardKeys}
                        onKeyClick={handleKeyClick}
                    />

                    <div className="mt-5 flex min-h-[44px] flex-wrap items-center gap-2">
                        <span className="text-sm text-[var(--muted)]">
                            Current shortcut :
                        </span>

                        {keyboardKeys.length === 0 ? (
                            <span className="text-sm text-[var(--muted)]">
                                No keys selected
                            </span>
                        ) : (
                            sortShortcutKeys(keyboardKeys).map((key) => (
                                <span
                                    key={key}
                                    className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--accent-dark)]"
                                >
                                    {formatKey(key)}
                                </span>
                            ))
                        )}

                        {selectedKeys.length > 0 && (
                            <button
                                onClick={clearKeys}
                                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm text-[var(--text)]"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div
                    onMouseLeave={() => setHoveredShortcut(null)}
                    className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2"
                >
                    {results.length === 0 && (
                        <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--muted)]">
                            No shortcuts found
                        </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.map((shortcut) => (
                            <button
                                key={`${shortcut.app}-${shortcut.title}`}
                                onMouseEnter={() => setHoveredShortcut(shortcut)}
                                onClick={() => setOpenedShortcut(shortcut)}
                                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all hover:shadow-lg"
                            >
                                <p className="text-xs text-[var(--muted)]">
                                    {shortcut.app}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                                    {shortcut.title}
                                </p>

                                <p className="mt-3 text-sm text-[var(--accent-dark)]">
                                    {formatShortcut(shortcut.keys)}
                                </p>
                            </button>
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