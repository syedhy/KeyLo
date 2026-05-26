import Navbar from "./Navbar"

export default function PageShell({
    children ,
    centerContent = false ,
    className = "" ,
    maxWidth = "max-w-7xl"
}) {
    const spacingClass = centerContent
        ? "py-4 sm:py-6 lg:py-8"
        : "pb-6"

    return (
        <main className="min-h-screen overflow-x-hidden bg-(--bg)">
            <Navbar />

            <section
                className={`mx-auto flex w-full ${maxWidth} min-h-[calc(100vh_-_var(--nav-height))] min-h-[calc(100dvh_-_var(--nav-height))] flex-col px-4 sm:px-6 lg:px-8 ${spacingClass} ${className}`}
            >
                {children}
            </section>
        </main>
    )
}
