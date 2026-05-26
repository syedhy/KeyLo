import { formatShortcut } from "../utils/shortcuts"

export default function ShortcutModal({ shortcut , onClose }) {
    if (!shortcut) return null

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-md"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[calc(100vh_-_2rem)] max-h-[calc(100dvh_-_2rem)] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-(--border) bg-(--surface) p-5 shadow-(--shadow) sm:p-7"
            >
                <p className="text-sm text-(--muted)">
                    {shortcut.app}
                </p>

                <h2 className="mt-2 break-words text-2xl font-semibold text-(--text) sm:text-3xl">
                    {shortcut.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-(--muted)">
                    {shortcut.description || "No description added yet"}
                </p>

                <div className="mt-6 rounded-3xl bg-(--bg) p-4">
                    <p className="text-xs text-(--muted)">
                        Shortcut
                    </p>

                    <p className="mt-2 break-words text-base font-semibold text-(--accent-dark) sm:text-lg">
                        {formatShortcut(shortcut.keys)}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-full bg-(--text) px-5 py-3 text-sm text-(--surface)"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
