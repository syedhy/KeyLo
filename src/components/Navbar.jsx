import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"

import { loginWithGoogle , logoutUser } from "../firebase/authService"
import { useAuth } from "../context/useAuth"

export default function Navbar() {
    const { user } = useAuth()

    const links = [
        { label : "Home" , to : "/" } ,
        { label : "List" , to : "/apps" } ,
        { label : "Editor" , to : "/editor" }
    ]

    return (
        <nav className="relative z-20 flex h-14 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-white/10 bg-white/6 shadow-[0_0_24px_rgba(255,255,255,0.08)]">
                    <span className="text-lg font-semibold text-white">
                        K
                    </span>
                </div>

                <div>
                    <h1 className="text-[1rem] font-semibold tracking-tight text-(--text)">
                        KeyLo
                    </h1>

                    <p className="text-[0.68rem] text-slate-500">
                        Visual shortcut explorer
                    </p>
                </div>
            </div>

            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/4 px-1.5 py-1.5 shadow-sm backdrop-blur-xl md:flex">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `rounded-full px-3 py-1.5 text-xs transition-all ${
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

            {user ? (
                <button
                    onClick={logoutUser}
                    className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 md:block"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={loginWithGoogle}
                    className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 md:block"
                >
                    Login
                </button>
            )}

            <button className="rounded-full p-3 md:hidden">
                <Menu size={18} />
            </button>
        </nav>
    )
}