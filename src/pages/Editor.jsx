import { useMemo , useState } from "react"

import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"
import WorkspaceHeader from "../components/WorkspaceHeader"

import { saveUserApp , deleteUserApp } from "../firebase/shortcutService"
import { useAuth } from "../context/useAuth"
import { formatKey } from "../utils/shortcuts"

export default function Editor({ apps , setApps }) {
    const { user } = useAuth()

    const [selectedAppId , setSelectedAppId] = useState(apps[0]?.id || "vscode")
    const [selectedKeys , setSelectedKeys] = useState([])
    const [deleteAppOpen , setDeleteAppOpen] = useState(false)

    const [appName , setAppName] = useState("")
    const [shortcutTitle , setShortcutTitle] = useState("")
    const [shortcutDescription , setShortcutDescription] = useState("")

    const selectedApp = useMemo(() => {
        return apps.find((app) => app.id === selectedAppId) || apps[0]
    } , [apps , selectedAppId])

    function handleKeyClick(key) {
        setSelectedKeys((currentKeys) => {
            if (currentKeys.includes(key)) {
                return currentKeys.filter((item) => item !== key)
            }

            return [...currentKeys , key]
        })
    }

    async function addShortcut() {
        if (!user || !selectedApp) return
        if (!shortcutTitle.trim()) return
        if (selectedKeys.length === 0) return

        const updatedApp = {
            ...selectedApp ,
            shortcuts : [
                ...(selectedApp.shortcuts || []) ,
                {
                    title : shortcutTitle.trim() ,
                    description : shortcutDescription.trim() ,
                    keys : selectedKeys
                }
            ]
        }

        await saveUserApp(user.uid , updatedApp)

        setApps((currentApps) =>
            currentApps.map((app) =>
                app.id === updatedApp.id ? updatedApp : app
            )
        )

        setShortcutTitle("")
        setShortcutDescription("")
        setSelectedKeys([])
    }

    async function addApp() {
        if (!user) return
        if (!appName.trim()) return

        const id = appName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g , "-")
            .replace(/^-+|-+$/g , "")

        const newApp = {
            id ,
            name : appName.trim() ,
            description : `${appName.trim()} shortcuts` ,
            shortcuts : []
        }

        await saveUserApp(user.uid , newApp)

        setApps((currentApps) => [...currentApps , newApp])
        setSelectedAppId(id)
        setAppName("")
    }

    async function deleteShortcut(index) {
        if (!user || !selectedApp) return

        const updatedApp = {
            ...selectedApp ,
            shortcuts : selectedApp.shortcuts.filter((_ , shortcutIndex) => shortcutIndex !== index)
        }

        await saveUserApp(user.uid , updatedApp)

        setApps((currentApps) =>
            currentApps.map((app) =>
                app.id === updatedApp.id ? updatedApp : app
            )
        )
    }

    async function removeApp() {
        if (!user || !selectedApp) return

        await deleteUserApp(user.uid , selectedApp.id)

        const updatedApps = apps.filter((app) => app.id !== selectedApp.id)

        setApps(updatedApps)
        setSelectedAppId(updatedApps[0]?.id || "")
        setDeleteAppOpen(false)
    }

    return (
        <PageShell maxWidth="max-w-[98rem]" className="editor-page gap-[clamp(0.6rem,1.2vh,1rem)]">
            <div className="workspace-layout editor-layout flex w-full flex-col gap-[clamp(0.4rem,0.85vh,0.75rem)]">
                <WorkspaceHeader
                    eyebrow="Editor"
                    title="Build shortcuts with a calmer workspace"
                    description="The full keyboard stays on desktop, while mobile keeps the editor lightweight and gets shortcuts on screen faster."
                    compact
                    stats={[
                        {
                            label : "apps" ,
                            value : apps.length
                        } ,
                        {
                            label : "selected app" ,
                            value : selectedApp?.name || "none"
                        }
                    ]}
                />

                <div className="flex flex-col gap-2.5 xl:grid xl:grid-cols-[15rem_minmax(0,1fr)]">
                    <aside className="doodle-panel order-2 p-3.5 lg:sticky lg:top-4 lg:self-start xl:order-none">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                                Apps
                            </h2>

                            <p className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                                {apps.length}
                            </p>
                        </div>

                        <div className="editor-app-list mt-3 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:max-h-[40vh] xl:grid-cols-1">
                            {apps.map((app) => (
                                <button
                                    type="button"
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                                        selectedAppId === app.id
                                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)] shadow-[0_10px_24px_rgba(38,42,52,0.10)]"
                                            : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                                    }`}
                                >
                                    {app.name}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3.5">
                            <input
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                placeholder="New app name"
                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                            />

                            <button
                                type="button"
                                onClick={addApp}
                                className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(38,42,52,0.18)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_28px_rgba(38,42,52,0.24)]"
                            >
                                Add App
                            </button>

                            {selectedApp && (
                                <button
                                    type="button"
                                    onClick={() => setDeleteAppOpen(true)}
                                    className="mt-3 w-full rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-500/15"
                                >
                                    Delete Selected App
                                </button>
                            )}
                        </div>
                    </aside>

                    <div className="order-1 flex min-w-0 flex-col gap-2.5 xl:order-none">
                        <div className="doodle-panel order-2 p-3.5 sm:p-4 xl:order-1">
                            <div className="grid gap-2.5 md:grid-cols-2">
                                <input
                                    value={shortcutTitle}
                                    onChange={(e) => setShortcutTitle(e.target.value)}
                                    placeholder="Shortcut name"
                                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                                />

                                <input
                                    value={shortcutDescription}
                                    onChange={(e) => setShortcutDescription(e.target.value)}
                                    placeholder="Description"
                                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:bg-[var(--paper)]"
                                />
                            </div>

                            <div className="mt-3 hidden md:block">
                                <HeroKeyboard
                                    activeKeys={selectedKeys}
                                    density="home"
                                    onKeyClick={handleKeyClick}
                                />
                            </div>

                            <div className="mt-3.5 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-[var(--muted)]">
                                    Selected keys:
                                </span>

                                {selectedKeys.length === 0 ? (
                                    <span className="text-sm text-[var(--muted)]">
                                        No keys selected
                                    </span>
                                ) : (
                                    selectedKeys.map((key) => (
                                        <span
                                            key={key}
                                            className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-sm font-medium text-[var(--text)]"
                                        >
                                            {formatKey(key)}
                                        </span>
                                    ))
                                )}

                                {selectedKeys.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedKeys([])}
                                        className="rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-1 text-sm font-medium text-[var(--accent-dark)] transition hover:bg-[var(--surface-soft)]"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={addShortcut}
                                className="mt-3.5 rounded-full border border-[var(--border)] bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--paper)] shadow-[0_14px_28px_rgba(20,25,34,0.11)] transition hover:bg-[var(--accent-dark)]"
                            >
                                Save Shortcut
                            </button>
                        </div>

                        <div className="doodle-panel order-1 p-3.5 sm:p-4 xl:order-2">
                            <div className="mb-2.5 flex flex-col gap-3 rounded-[1.35rem_1.6rem_1.25rem_1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-[1.02rem] font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-[1.1rem]">
                                        {selectedApp?.name || "No app selected"} shortcuts
                                    </h2>

                                    <p className="mt-1 text-[0.86rem] leading-6 text-[var(--muted)]">
                                        Manage shortcuts saved for this app
                                    </p>
                                </div>

                                <p className="rounded-full border border-[var(--border)] bg-[var(--paper)] px-3.5 py-1.5 text-sm font-medium text-[var(--accent-dark)]">
                                    {selectedApp?.shortcuts?.length || 0} shortcuts
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                {selectedApp?.shortcuts?.map((shortcut , index) => (
                                    <div
                                        key={`${shortcut.title}-${index}`}
                                        className="rounded-[1.35rem_1.6rem_1.25rem_1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] sm:p-3.5"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                                            {shortcut.title}
                                        </p>

                                        <p className="mt-2 text-[0.88rem] leading-6 text-[var(--muted)]">
                                            {shortcut.keys.map(formatKey).join(" + ")}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => deleteShortcut(index)}
                                            className="mt-3 rounded-full border border-red-300/40 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-500/15"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deleteAppOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(24,27,36,0.44)] px-4 py-6 backdrop-blur-lg">
                    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] p-6 shadow-[var(--shadow)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                            Delete app
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                            Delete {selectedApp?.name}?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            This will permanently delete this app and all shortcuts inside it. This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteAppOpen(false)}
                                className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-hover)]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={removeApp}
                                className="rounded-full border border-red-300/40 bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(239,68,68,0.2)] transition hover:translate-y-[-1px]"
                            >
                                Delete app
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    )
}
