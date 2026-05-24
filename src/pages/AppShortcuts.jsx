import { useMemo , useState } from "react"
import { Link , useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"
import { apps } from "../data/sampleApps"

export default function AppShortcuts() {
    const { appId } = useParams()
    const app = apps.find((item) => item.id === appId) || apps[0]

    const [selectedShortcut , setSelectedShortcut] = useState(app.shortcuts[null])
    const [search , setSearch] = useState("")

    const filteredShortcuts = useMemo(() => {
        return app.shortcuts.filter((shortcut) => {
            const text = `${shortcut.title} ${shortcut.keys.join(" ")}`.toLowerCase()
            return text.includes(search.toLowerCase())
        })
    } , [app.shortcuts , search])

    return (
        <main className="h-screen overflow-hidden bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <Link to="/apps" className="text-sm text-[var(--muted)]">
                        ← Back to apps
                    </Link>

                    <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-[var(--text)]">
                                {app.name}
                            </h1>

                            <p className="mt-2 text-[var(--muted)]">
                                Search shortcuts and hover any card to highlight keys
                            </p>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search shortcuts..."
                            className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm outline-none md:w-80"
                        />
                    </div>

                <HeroKeyboard activeKeys={selectedShortcut?.keys || []} />
                </div>

                <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredShortcuts.map((shortcut) => (
                            <button
                                key={shortcut.title}
                                onMouseEnter={() => setSelectedShortcut(shortcut)}
                                onMouseLeave={() => setSelectedShortcut(null)}
                                className={`rounded-3xl border p-5 text-left transition-all ${selectedShortcut?.title === shortcut.title
                                        ? "border-[var(--accent)] bg-[var(--surface)] shadow-[var(--shadow)]"
                                        : "border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1 hover:shadow-lg"
                                    }`}
                            >
                                <p className="text-sm font-semibold text-[var(--text)]">
                                    {shortcut.title}
                                </p>

                                <p className="mt-3 text-sm text-[var(--accent-dark)]">
                                    {shortcut.keys.join(" + ")}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}