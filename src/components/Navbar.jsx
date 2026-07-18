import { Menu , X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useState } from "react"

import { loginWithGoogle , logoutUser } from "../firebase/authService"
import { useAuth } from "../context/useAuth"

export default function Navbar() {
    const { user } = useAuth()
    const [menuOpen , setMenuOpen] = useState(false)
    const [loginErrorOpen , setLoginErrorOpen] = useState(false)

    const links = [
        { label : "Overview" , to : "/" } ,
        { label : "Browse" , to : "/apps" } ,
        { label : "Editor" , to : "/editor" }
    ]

    return (
        <nav className="relative z-20 border-b border-[var(--border)] bg-[rgba(249,251,252,0.84)] backdrop-blur-2xl">
            <div className="mx-auto flex min-h-[var(--nav-height)] w-full max-w-[96rem] items-center gap-3 px-4 sm:px-6 lg:px-10 xl:px-12">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-[var(--border-strong)] bg-[var(--paper)] shadow-[0_14px_32px_rgba(20,25,34,0.08)] sm:h-14 sm:w-14">
                        <span className="text-[1.4rem] font-semibold text-[var(--text)]">
                            K
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-[1.1rem] font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-[1.25rem]">
                            Keylo
                        </h1>

                        <p className="hidden text-xs text-[var(--muted)] sm:block">
                            Doodle shortcut studio
                        </p>
                    </div>
                </div>

                <div className="hidden flex-1 items-center justify-center md:flex">
                    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--paper)] p-1 shadow-[0_10px_24px_rgba(20,25,34,0.05)]">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-[var(--accent-soft)] text-[var(--accent-dark)] shadow-[inset_0_0_0_1px_rgba(38,42,52,0.18)]"
                                            : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                        Cmd K
                    </div>

                    <AuthButton
                        user={user}
                        onLoginFailure={() => setLoginErrorOpen(true)}
                    />
                </div>

                <button
                    type="button"
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setMenuOpen((current) => !current)}
                    className="ml-auto rounded-full border border-[var(--border)] bg-[var(--paper)] p-3 text-[var(--text)] shadow-[0_10px_24px_rgba(20,25,34,0.06)] transition hover:bg-[var(--surface-soft)] md:hidden"
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {menuOpen && (
                <div className="absolute left-4 right-4 top-full z-30 -mt-1 rounded-[1.75rem] border border-[var(--border)] bg-[var(--paper)] p-3 shadow-[var(--shadow)] backdrop-blur-2xl md:hidden">
                    <div className="grid gap-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-[var(--accent-soft)] text-[var(--accent-dark)]"
                                            : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
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
                        onLoginFailure={() => setLoginErrorOpen(true)}
                    />
                </div>
            )}

            {loginErrorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,27,36,0.44)] px-4 py-6 backdrop-blur-lg">
                    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] p-6 text-center shadow-[var(--shadow)]">
                        <button
                            type="button"
                            aria-label="Close login error"
                            onClick={() => setLoginErrorOpen(false)}
                            className="ml-auto flex rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                        >
                            <X size={16} />
                        </button>

                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                            Login failed
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            Please disable your ad blocker to log in, or use a browser without one.
                        </p>

                        <button
                            type="button"
                            onClick={() => setLoginErrorOpen(false)}
                            className="mt-6 rounded-full border border-[var(--border)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-[0_14px_24px_rgba(38,42,52,0.22)]"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

function AuthButton({ user , className = "" , onAction , onLoginFailure }) {
    async function handleClick() {
        onAction?.()

        if (user) {
            logoutUser()
            return
        }

        const loggedInUser = await loginWithGoogle()

        if (!loggedInUser) {
            onLoginFailure?.()
        }
    }

    return user ? (
        <button
            type="button"
            onClick={handleClick}
            className={`rounded-full border border-[var(--border)] bg-[var(--paper)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] shadow-[0_10px_24px_rgba(20,25,34,0.05)] transition hover:bg-[var(--surface-soft)] ${className}`}
        >
            Logout
        </button>
    ) : (
        <button
            type="button"
            onClick={handleClick}
            className={`rounded-full border border-[var(--border)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(38,42,52,0.18)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_28px_rgba(38,42,52,0.24)] ${className}`}
        >
            Login
        </button>
    )
}
