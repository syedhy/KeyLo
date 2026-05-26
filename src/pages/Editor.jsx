import { useMemo , useState } from "react"

import HeroKeyboard from "../components/HeroKeyboard"
import PageShell from "../components/PageShell"

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

        const id = appName.toLowerCase().replaceAll(" " , "-")

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
        <PageShell maxWidth="max-w-[82rem]" className="editor-page gap-4">
            <div className="editor-landing w-full pt-3">
                <div className="editor-heading">
                    <h1 className="text-2xl font-semibold text-(--text) sm:text-3xl">
                        Shortcut Editor
                    </h1>

                    <p className="mt-1 text-sm text-(--muted)">
                        Add apps and create shortcuts by clicking keys visually
                    </p>
                </div>

                <div className="editor-layout grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
                    <aside className="editor-sidebar rounded-[2rem] bg-transparent p-4 sm:p-5 lg:sticky lg:top-4 lg:self-start">
                        <h2 className="text-sm font-semibold text-white">
                            Apps
                        </h2>

                        <div className="editor-app-list mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:max-h-[42vh] lg:max-h-[42dvh] lg:grid-cols-1">
                            {apps.map((app) => (
                                <button
                                    type="button"
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                                        selectedAppId === app.id
                                            ? "border-white/30 bg-white/[0.10] text-white"
                                            : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                                >
                                    {app.name}
                                </button>
                            ))}
                        </div>

                        <div className="mt-5">
                            <input
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                placeholder="New app name"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                            />

                            <button
                                type="button"
                                onClick={addApp}
                                className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_28px_rgba(255,255,255,0.18)]"
                            >
                                Add App
                            </button>

                            {selectedApp && (
                                <button
                                    type="button"
                                    onClick={() => setDeleteAppOpen(true)}
                                    className="mt-3 w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                                >
                                    Delete Selected App
                                </button>
                            )}
                        </div>
                    </aside>

                    <div className="editor-main flex min-w-0 flex-col gap-4">
                        <div className="editor-form-card rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <input
                                    value={shortcutTitle}
                                    onChange={(e) => setShortcutTitle(e.target.value)}
                                    placeholder="Shortcut name"
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
                                />

                                <input
                                    value={shortcutDescription}
                                    onChange={(e) => setShortcutDescription(e.target.value)}
                                    placeholder="Description"
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
                                />
                            </div>

                            <div className="editor-keyboard-wrap mt-4">
                                <HeroKeyboard
                                    activeKeys={selectedKeys}
                                    density="editor"
                                    onKeyClick={handleKeyClick}
                                />
                            </div>

                            <div className="editor-selected-row mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-slate-500">
                                    Selected keys :
                                </span>

                                {selectedKeys.length === 0 ? (
                                    <span className="text-sm text-slate-500">
                                        No keys selected
                                    </span>
                                ) : (
                                    selectedKeys.map((key) => (
                                        <span
                                            key={key}
                                            className="rounded-full bg-white/[0.07] px-3 py-1 text-sm text-white"
                                        >
                                            {formatKey(key)}
                                        </span>
                                    ))
                                )}

                                {selectedKeys.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedKeys([])}
                                        className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={addShortcut}
                                className="mt-3 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                            >
                                Save Shortcut
                            </button>
                    </div>

                        <div className="editor-manage-card rounded-[1.5rem] bg-transparent">
                            <div className="editor-manage-header mb-4 flex flex-col gap-4 rounded-[1.5rem] bg-white/[0.035] px-5 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {selectedApp?.name || "No app selected"} Shortcuts
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage shortcuts saved for this app
                                    </p>
                                </div>

                                <p className="rounded-full bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
                                    {selectedApp?.shortcuts?.length || 0} shortcuts
                                </p>
                            </div>

                            <div className="editor-shortcut-list p-1 sm:p-4">
                                <div className="editor-shortcut-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {selectedApp?.shortcuts?.map((shortcut , index) => (
                                        <div
                                            key={`${shortcut.title}-${index}`}
                                            className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/25 hover:bg-white/[0.06]"
                                        >
                                            <p className="text-sm font-semibold text-white">
                                                {shortcut.title}
                                            </p>

                                            <p className="mt-3 text-xs text-slate-300">
                                                {shortcut.keys.map(formatKey).join(" + ")}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => deleteShortcut(index)}
                                                className="mt-3 rounded-lg border border-red-400/20 px-2.5 py-1.5 text-[11px] font-semibold text-red-200 transition hover:bg-red-500/10"
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
            </div>

            {deleteAppOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-xl">
                    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                        <p className="text-sm font-medium text-red-300">
                            Delete app
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold text-white">
                            Delete {selectedApp?.name}?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            This will permanently delete this app and all shortcuts inside it. This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteAppOpen(false)}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={removeApp}
                                className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 hover:shadow-[0_0_28px_rgba(239,68,68,0.24)]"
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
