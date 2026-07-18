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
            className="shortcut-card doodle-panel doodle-panel--interactive group min-w-0 p-3.5 text-left transition-[background-color,border-color,box-shadow,color] duration-150 sm:p-4"
        >
            <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {shortcut.app}
            </p>

            <p className="mt-2 break-words text-[0.96rem] font-semibold tracking-[-0.02em] text-[var(--text)] sm:mt-2.5 sm:text-[1rem]">
                {shortcut.title}
            </p>

            {showDescription && (
                <p className="shortcut-card__description mt-2.5 break-words text-sm leading-6 text-[var(--muted)]">
                    {shortcut.description || "No description added yet"}
                </p>
            )}

            <p className="mt-3.5 break-words text-sm font-semibold text-[var(--accent-dark)]">
                {formatShortcut(shortcut.keys)}
            </p>
        </button>
    )
}
