import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"

import { saveUserApp , deleteUserApp } from "../firebase/shortcutService"
import { useAuth } from "../context/useAuth"

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
        <main className="h-screen overflow-hidden bg-(--bg)">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px)] max-w-[92rem] flex-col overflow-hidden px-6 pb-6">
                <div className="shrink-0 pt-6">
                    <h1 className="text-4xl font-semibold text-(--text)">
                        Shortcut Editor
                    </h1>

                    <p className="mt-2 text-(--muted)">
                        Add apps and create shortcuts by clicking keys visually
                    </p>
                </div>

                <div className="mt-8 grid min-h-0 flex-1 gap-6 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                        <h2 className="text-sm font-semibold text-white">
                            Apps
                        </h2>

                        <div className="mt-4 space-y-2">
                            {apps.map((app) => (
                                <button
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

                        <div className="mt-6">
                            <input
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                placeholder="New app name"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                            />

                            <button
                                onClick={addApp}
                                className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_28px_rgba(255,255,255,0.18)]"
                            >
                                Add App
                            </button>

                            {selectedApp && (
                                <button
                                    onClick={() => setDeleteAppOpen(true)}
                                    className="mt-3 w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                                >
                                    Delete Selected App
                                </button>
                            )}
                        </div>
                    </aside>

                    <div className="flex min-h-0 min-w-0 flex-col gap-6 overflow-hidden">
                        <div className="shrink-0 overflow-visible rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    value={shortcutTitle}
                                    onChange={(e) => setShortcutTitle(e.target.value)}
                                    placeholder="Shortcut name"
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                                />

                                <input
                                    value={shortcutDescription}
                                    onChange={(e) => setShortcutDescription(e.target.value)}
                                    placeholder="Description"
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                                />
                            </div>

                            <div className="mt-6 flex justify-center overflow-hidden">
                                <div className="w-full max-w-[980px] overflow-hidden rounded-[2rem]">
                                    <div className="flex justify-center">
                                        <div className="origin-top scale-[0.78]">
                                            <HeroKeyboard
                                                activeKeys={selectedKeys}
                                                onKeyClick={handleKeyClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
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
                                        onClick={() => setSelectedKeys([])}
                                        className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={addShortcut}
                                className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                            >
                                Save Shortcut
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
                            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] px-5 py-5 backdrop-blur-xl">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {selectedApp?.name || "No app selected"} Shortcuts
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage shortcuts saved for this app
                                    </p>
                                </div>

                                <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                                    {selectedApp?.shortcuts?.length || 0} shortcuts
                                </p>
                            </div>

                            <div className="h-[calc(100%-88px)] overflow-y-auto p-5">
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {selectedApp?.shortcuts?.map((shortcut , index) => (
                                        <div
                                            key={`${shortcut.title}-${index}`}
                                            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_0_18px_rgba(255,255,255,0.10),0_14px_32px_rgba(0,0,0,0.28)]"
                                        >
                                            <p className="text-sm font-semibold text-white">
                                                {shortcut.title}
                                            </p>

                                            <p className="mt-2 min-h-[36px] text-xs leading-5 text-slate-500">
                                                {shortcut.description || "No description"}
                                            </p>

                                            <p className="mt-4 text-sm text-slate-300">
                                                {shortcut.keys.map(formatKey).join(" + ")}
                                            </p>

                                            <button
                                                onClick={() => deleteShortcut(index)}
                                                className="mt-4 rounded-xl border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
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
            </section>

            {deleteAppOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xl">
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
                                onClick={() => setDeleteAppOpen(false)}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={removeApp}
                                className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 hover:shadow-[0_0_28px_rgba(239,68,68,0.24)]"
                            >
                                Delete app
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
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
        ControlLeft : "Ctrl" ,
        ControlRight : "Ctrl"
    }

    return labels[key] || key
}