import { useMemo , useState } from "react"

import Navbar from "../components/Navbar"

export default function Editor({ apps , setApps }) {

    const [form , setForm] = useState({
        appId : apps[0].id ,
        title : "" ,
        description : "" ,
        keys : ""
    })

    const allShortcuts = useMemo(() => {
        return apps.flatMap((app) =>
            app.shortcuts.map((shortcut) => ({
                ...shortcut ,
                app : app.name ,
                appId : app.id
            }))
        )
    } , [apps])

    function addShortcut(e) {
        e.preventDefault()

        if (!form.title.trim() || !form.keys.trim()) return

        const newShortcut = {
            title : form.title.trim() ,
            description : form.description.trim() ,
            keys : form.keys
                .split("+")
                .map((key) => normalizeKeyInput(key.trim()))
                .filter(Boolean)
        }

        setApps((currentApps) =>
            currentApps.map((app) => {
                if (app.id !== form.appId) return app

                return {
                    ...app ,
                    shortcuts : [...app.shortcuts , newShortcut]
                }
            })
        )

        setForm({
            appId : form.appId ,
            title : "" ,
            description : "" ,
            keys : ""
        })
    }

    function deleteShortcut(shortcutToDelete) {
        setApps((currentApps) =>
            currentApps.map((app) => {
                if (app.id !== shortcutToDelete.appId) return app

                return {
                    ...app ,
                    shortcuts : app.shortcuts.filter(
                        (shortcut) => shortcut.title !== shortcutToDelete.title
                    )
                }
            })
        )
    }

    return (
        <main className="h-screen overflow-hidden bg-(--bg)">
            <Navbar />

            <section className="mx-auto flex h-[calc(100vh-88px) max-w-7xl flex-col px-6 pb-6">
                <div className="shrink-0 pt-4">
                    <h1 className="text-4xl font-semibold text-(--text)">
                        Shortcut Editor
                    </h1>

                    <p className="mt-2 text-(--muted)">
                        Add and delete shortcuts from your current shortcut library
                    </p>

                    <form
                        onSubmit={addShortcut}
                        className="mt-6 grid gap-3 rounded-4xl border border-(--border) bg-(--surface) p-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_1.4fr_auto]"
                    >
                        <select
                            value={form.appId}
                            onChange={(e) =>
                                setForm({
                                    ...form ,
                                    appId : e.target.value
                                })
                            }
                            className="rounded-full border border-(--border) bg-(--bg) px-5 py-3 text-sm outline-none"
                        >
                            {apps.map((app) => (
                                <option key={app.id} value={app.id}>
                                    {app.name}
                                </option>
                            ))}
                        </select>

                        <input
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form ,
                                    title : e.target.value
                                })
                            }
                            placeholder="Shortcut title"
                            className="rounded-full border border-(--border) bg-(--bg) px-5 py-3 text-sm outline-none"
                        />

                        <input
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form ,
                                    description : e.target.value
                                })
                            }
                            placeholder="Description"
                            className="rounded-full border border-(--border) bg-(--bg) px-5 py-3 text-sm outline-none"
                        />

                        <input
                            value={form.keys}
                            onChange={(e) =>
                                setForm({
                                    ...form ,
                                    keys : e.target.value
                                })
                            }
                            placeholder="Cmd + Shift + P"
                            className="rounded-full border border-(--border) bg-(--bg) px-5 py-3 text-sm outline-none"
                        />

                        <button className="rounded-full bg-(--text) px-6 py-3 text-sm text-(--surface)">
                            Add
                        </button>
                    </form>
                </div>

                <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {allShortcuts.map((shortcut) => (
                            <div
                                key={`${shortcut.app}-${shortcut.title}`}
                                className="rounded-3xl border border-(--border) bg-(--surface) p-5"
                            >
                                <p className="text-xs text-(--muted)">
                                    {shortcut.app}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-(--text)">
                                    {shortcut.title}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-(--muted)">
                                    {shortcut.description || "No description added yet"}
                                </p>

                                <p className="mt-3 text-sm text-(--accent-dark)">
                                    {formatShortcut(shortcut.keys)}
                                </p>

                                <button
                                    onClick={() => deleteShortcut(shortcut)}
                                    className="mt-4 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

function normalizeKeyInput(key) {
    const cleaned = key.toLowerCase()

    const labels = {
        cmd : "CmdLeft" ,
        command : "CmdLeft" ,
        option : "OptionLeft" ,
        alt : "OptionLeft" ,
        shift : "ShiftLeft" ,
        control : "ControlLeft" ,
        ctrl : "ControlLeft" ,
        space : "Space" ,
        enter : "Enter" ,
        return : "Enter" ,
        delete : "Delete" ,
        backspace : "Delete" ,
        tab : "Tab" ,
        esc : "Esc" ,
        escape : "Esc"
    }

    return labels[cleaned] || key.toUpperCase()
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