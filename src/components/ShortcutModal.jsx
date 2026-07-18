import { formatShortcut } from "../utils/shortcuts"

export default function ShortcutModal({ shortcut , onClose }) {
    if (!shortcut) return null

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(24,27,36,0.44)] px-4 py-6 backdrop-blur-lg"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[calc(100vh_-_2rem)] max-h-[calc(100dvh_-_2rem)] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] p-5 shadow-[var(--shadow)] sm:p-7"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                    {shortcut.app}
                </p>

                <h2 className="mt-3 break-words text-[clamp(1.6rem,2.4vw,2.35rem)] font-semibold tracking-[-0.04em] text-[var(--text)]">
                    {shortcut.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    {shortcut.description || "No description added yet"}
                </p>

                <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Shortcut
                    </p>

                    <p className="mt-3 break-words text-base font-semibold text-[var(--accent-dark)] sm:text-lg">
                        {formatShortcut(shortcut.keys)}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-full border border-[var(--border)] bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--paper)] shadow-[0_14px_28px_rgba(20,25,34,0.12)] transition hover:translate-y-[-1px]"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
