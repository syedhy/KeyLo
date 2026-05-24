export default function ShortcutModal({ shortcut , onClose }) {
    if (!shortcut) return null

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]"
            >
                <p className="text-sm text-[var(--muted)]">
                    {shortcut.app}
                </p>

                <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">
                    {shortcut.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                    {shortcut.description || "No description added yet"}
                </p>

                <div className="mt-6 rounded-3xl bg-[var(--bg)] p-4">
                    <p className="text-xs text-[var(--muted)]">
                        Shortcut
                    </p>

                    <p className="mt-2 text-lg font-semibold text-[var(--accent-dark)]">
                        {formatShortcut(shortcut.keys)}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-full bg-[var(--text)] px-5 py-3 text-sm text-[var(--surface)]"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

function formatKey(key) {
    const labels = {
        CmdLeft : "Cmd" ,
        CmdRight : "Cmd" ,
        OptionLeft : "Option" ,
        OptionRight : "Option" ,
        ShiftLeft : "Shift" ,
        ShiftRight : "Shift" ,
        ControlLeft : "Control" ,
        ControlRight : "Control"
    }

    return labels[key] || key
}

function formatShortcut(keys) {
    return keys.map(formatKey).join(" + ")
}