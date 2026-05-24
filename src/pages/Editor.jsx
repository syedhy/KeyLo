import Navbar from "../components/Navbar"

export default function Editor() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="text-4xl font-semibold text-[var(--text)]">
                    Shortcut Editor
                </h1>

                <p className="mt-3 text-[var(--muted)]">
                    Add , edit and delete shortcuts here
                </p>
            </section>
        </main>
    )
}