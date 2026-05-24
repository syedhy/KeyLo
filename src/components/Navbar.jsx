import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
            <Link
                to="/"
                className="text-xl font-semibold tracking-tight text-[var(--text)]"
            >
                KeyLo
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-2 shadow-sm md:flex">
                <Link
                    to="/"
                    className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                    Home
                </Link>

                <Link
                    to="/apps"
                    className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                    Apps
                </Link>

                <button className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]">
                    Keyboard
                </button>
            </div>

            <button className="hidden rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-medium text-[var(--surface)] transition-colors hover:bg-[var(--accent-dark)] md:block">
                Explore
            </button>

            <button className="rounded-full border border-[var(--border)] bg-[var(--surface)] p-3 md:hidden">
                <Menu size={18} />
            </button>
        </nav>
    )
}