import { BrowserRouter , Routes , Route } from "react-router-dom"

import Home from "./pages/Home"
import Apps from "./pages/Apps"
import AppShortcuts from "./pages/AppShortcuts"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/apps/:appId" element={<AppShortcuts />} />
            </Routes>
        </BrowserRouter>
    )
}