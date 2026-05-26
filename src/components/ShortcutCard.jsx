import { formatShortcut } from "../utils/shortcuts"

export default function ShortcutCard({
    shortcut ,
    onHover ,
    onOpen ,
    showDescription = false
}) {
    return (
        <button
            type="button"
            onMouseEnter={() => onHover?.(shortcut)}
            onClick={() => onOpen?.(shortcut)}
            className="group min-w-0 rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-[0_0_34px_rgba(255,255,255,0.16),0_18px_45px_rgba(0,0,0,0.30)]"
        >
            <p className="break-words text-xs font-medium text-slate-400">
                {shortcut.app}
            </p>

            <p className="mt-2 break-words text-sm font-semibold text-white">
                {shortcut.title}
            </p>

            {showDescription && (
                <p className="mt-2 break-words text-xs leading-5 text-slate-400">
                    {shortcut.description || "No description added yet"}
                </p>
            )}

            <p className="mt-4 break-words text-sm font-medium text-slate-200">
                {formatShortcut(shortcut.keys)}
            </p>
        </button>
    )
}
