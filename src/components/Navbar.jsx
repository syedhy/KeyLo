import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Navbar() {
    const links = [
        { label : "Home" , to : "/" } ,
        { label : "List" , to : "/apps" } ,
        { label : "Editor" , to : "/editor" }
    ]

    return (
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
                KeyLo
            </h1>

            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 shadow-sm backdrop-blur-xl md:flex">
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

            <button className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition-all hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] md:block">
                Explore
            </button>

            <button className="rounded-full border border-white/10 bg-white/[0.04] p-3 md:hidden">
                <Menu size={18} />
            </button>
        </nav>
    )
}