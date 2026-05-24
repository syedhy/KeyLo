import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Apps({ apps }) {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="text-4xl font-semibold text-[var(--text)]">
                    Apps
                </h1>

                <p className="mt-3 text-[var(--muted)]">
                    Choose an app and explore its shortcuts visually
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {apps.map((app) => (
                        <Link
                            key={app.id}
                            to={`/apps/${app.id}`}
                            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <h2 className="text-xl font-semibold text-[var(--text)]">
                                {app.name}
                            </h2>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                {app.description}
                            </p>

                            <p className="mt-6 text-sm text-[var(--accent-dark)]">
                                {app.shortcuts.length} shortcuts
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}