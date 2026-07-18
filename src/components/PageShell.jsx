import Navbar from "./Navbar"

export default function PageShell({
    children ,
    centerContent = false ,
    className = "" ,
    maxWidth = "max-w-[96rem]"
}) {
    const spacingClass = centerContent
        ? "py-[clamp(0.45rem,1.1vh,1.25rem)]"
        : "pb-[clamp(0.7rem,1.4vh,1.25rem)]"

    return (
        <main className="min-h-screen overflow-x-hidden bg-[var(--bg)]">
            <Navbar />

            <section
                className={`mx-auto flex w-full ${maxWidth} min-h-[calc(100vh_-_var(--nav-height))] min-h-[calc(100dvh_-_var(--nav-height))] flex-col px-4 sm:px-6 lg:px-10 xl:px-12 ${spacingClass} ${className}`}
            >
                {children}
            </section>
        </main>
    )
}
