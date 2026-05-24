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
            }
        }

        if (!authLoading) {
            loadApps()
        }
    } , [user , authLoading])

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