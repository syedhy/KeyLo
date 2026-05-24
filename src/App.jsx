import { useState } from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"

import Home from "./pages/Home"
import Apps from "./pages/Apps"
import AppShortcuts from "./pages/AppShortcuts"
import Editor from "./pages/Editor"

import { apps as sampleApps } from "./data/sampleApps"

export default function App() {
    const [apps , setApps] = useState(sampleApps)

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