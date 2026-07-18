import { useEffect , useState } from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"

import Home from "./pages/Home"
import Apps from "./pages/Apps"
import AppShortcuts from "./pages/AppShortcuts"
import Editor from "./pages/Editor"

import { getUserApps } from "./firebase/shortcutService"
import { useAuth } from "./context/useAuth"

export default function App() {
    const { user , authLoading } = useAuth()
    const [apps , setApps] = useState([])

    useEffect(() => {
        async function loadApps() {
            if (!user) {
                setApps([])
                return
            }

            try {
                const firebaseApps = await getUserApps(user.uid)
                setApps(firebaseApps)
            } catch (error) {
                console.error("Failed to load user apps" , error)
                setApps([])
            }
        }

        if (!authLoading) {
            loadApps()
        }
    } , [user , authLoading])

    if (authLoading) {
        return <LoadingScreen />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home apps={apps} />} />
                <Route path="/apps" element={<Apps apps={apps} />} />
                <Route path="/apps/:appId" element={<AppShortcuts apps={apps} />} />
                <Route path="/editor" element={<Editor apps={apps} setApps={setApps} />} />
            </Routes>
        </BrowserRouter>
    )
}

function LoadingScreen() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
            <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--paper)] px-6 py-8 text-center shadow-[var(--shadow)]">
                <p className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
                    Keylo
                </p>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--text)]">
                    Loading your workspace
                </h1>

                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Pulling in your apps and shortcuts so the UI can open with the right state.
                </p>

                <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent-soft)]" />
                </div>
            </div>
        </main>
    )
}
