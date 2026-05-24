import { useState } from "react"

import Navbar from "../components/Navbar"
import HeroKeyboard from "../components/HeroKeyboard"

const shortcuts = [
    {
        app : "VS Code" ,
        title : "Command Palette" ,
        keys : ["Cmd" , "Shift" , "P"]
    } ,
    {
        app : "Chrome" ,
        title : "Address Bar" ,
        keys : ["Cmd" , "L"]
    } ,
    {
        app : "Finder" ,
        title : "Spotlight Search" ,
        keys : ["Cmd" , "Space"]
    }
]

export default function Home() {
    const [selectedShortcut , setSelectedShortcut] = useState(shortcuts[0])

    return (
        <main className="min-h-screen overflow-hidden bg-[var(--bg)]">
            <Navbar />

            <section className="relative px-6 pt-12 text-center md:px-10 md:pt-20">
                <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-4xl">
                    <p className="mx-auto mb-5 w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)]">
                        A visual shortcut library for your favorite apps
                    </p>

                    <h1 className="text-5xl font-semibold tracking-tight text-[var(--text)] md:text-7xl">
                        Learn shortcuts
                        <span className="block text-[var(--accent)]">
                            without memorizing them
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                        Click a shortcut card and see the keyboard react visually
                    </p>
                </div>

                <HeroKeyboard
                    activeKeys={selectedShortcut.keys}
                    shortcuts={shortcuts}
                    onSelect={setSelectedShortcut}
                />
            </section>
        </main>
    )
}