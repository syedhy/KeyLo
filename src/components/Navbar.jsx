import { Menu , X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useState } from "react"

import { loginWithGoogle , logoutUser } from "../firebase/authService"
import { useAuth } from "../context/useAuth"

export default function Navbar() {
    const { user } = useAuth()
    const [menuOpen , setMenuOpen] = useState(false)

    const links = [
        { label : "Home" , to : "/" } ,
        { label : "List" , to : "/apps" } ,
        { label : "Editor" , to : "/editor" }
    ]

    return (
        <nav className="relative z-20 flex min-h-[var(--nav-height)] items-center justify-between px-4 py-5 sm:px-6 md:px-10">
            <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-white/6 shadow-[0_0_36px_rgba(255,255,255,0.10)]">
                    <span className="text-2xl font-semibold text-white">
                        K
                    </span>
                </div>

                <div>
                    <h1 className="text-[1.35rem] font-semibold text-(--text)">
                        KeyLo
                    </h1>

                    <p className="text-xs text-slate-500">
                        Visual shortcut explorer
                    </p>
                </div>
            </div>

            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/4 px-2 py-2 shadow-sm backdrop-blur-xl md:flex">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `rounded-full px-4 py-2 text-sm transition-all ${
                                isActive
                                    ? "bg-white text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.20)]"
                                    : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <AuthButton user={user} className="hidden md:block" />

            <button
                type="button"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen((current) => !current)}
                className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 md:hidden"
            >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {menuOpen && (
                <div className="absolute left-4 right-4 top-full z-30 rounded-3xl border border-white/10 bg-[#111827]/95 p-3 shadow-(--shadow) backdrop-blur-xl md:hidden">
                    <div className="grid gap-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-2xl px-4 py-3 text-sm transition-all ${
                                        isActive
                                            ? "bg-white text-slate-950"
                                            : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <AuthButton
                        user={user}
                        className="mt-3 w-full"
                        onAction={() => setMenuOpen(false)}
                    />
                </div>
            )}
        </nav>
    )
}

function AuthButton({ user , className = "" , onAction }) {
    function handleClick() {
        onAction?.()

        if (user) {
            logoutUser()
            return
        }

        loginWithGoogle()
    }

    return user ? (
        <button
            type="button"
            onClick={handleClick}
            className={`rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 ${className}`}
        >
            Logout
        </button>
    ) : (
        <button
            type="button"
            onClick={handleClick}
            className={`rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 ${className}`}
        >
            Login
        </button>
    )
}
