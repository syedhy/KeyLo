import { BrowserRouter , Routes , Route } from "react-router-dom"

import Home from "./pages/Home"
import Apps from "./pages/Apps"
import AppShortcuts from "./pages/AppShortcuts"
import Editor from "./pages/Editor"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/apps/:appId" element={<AppShortcuts />} />
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </BrowserRouter>
    )
}