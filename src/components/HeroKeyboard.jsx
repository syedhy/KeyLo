import { useState } from "react"
import "../styles/keyboard.css"

const rows = [
    [
        { label : "`" , sub : "~" } ,
        { label : "1" , sub : "!" } ,
        { label : "2" , sub : "@" } ,
        { label : "3" , sub : "#" } ,
        { label : "4" , sub : "$" } ,
        { label : "5" , sub : "%" } ,
        { label : "6" , sub : "^" } ,
        { label : "7" , sub : "&" } ,
        { label : "8" , sub : "*" } ,
        { label : "9" , sub : "(" } ,
        { label : "0" , sub : ")" } ,
        { label : "-" , sub : "_" } ,
        { label : "=" , sub : "+" } ,
        { label : "delete" , wide : "delete" }
    ] ,
    [
        { label : "tab" , wide : "tab" } ,
        { label : "Q" } , { label : "W" } , { label : "E" } , { label : "R" } , { label : "T" } ,
        { label : "Y" } , { label : "U" } , { label : "I" } , { label : "O" } , { label : "P" } ,
        { label : "[" , sub : "{" } ,
        { label : "]" , sub : "}" } ,
        { label : "\\" , sub : "|" }
    ] ,
    [
        { label : "caps lock" , wide : "caps" } ,
        { label : "A" } , { label : "S" } , { label : "D" } , { label : "F" } , { label : "G" } ,
        { label : "H" } , { label : "J" } , { label : "K" } , { label : "L" } ,
        { label : ";" , sub : ":" } ,
        { label : "'" , sub : '"' } ,
        { label : "return" , wide : "return" }
    ] ,
    [
        { label : "shift" , id : "ShiftLeft" , wide : "shiftLeft" } ,
        { label : "Z" } , { label : "X" } , { label : "C" } , { label : "V" } , { label : "B" } ,
        { label : "N" } , { label : "M" } ,
        { label : "," , sub : "<" } ,
        { label : "." , sub : ">" } ,
        { label : "/" , sub : "?" } ,
        { label : "shift" , id : "ShiftRight" , wide : "shiftRight" }
    ]
]

const bottomLeftKeys = [
    { label : "fn" } ,
    { label : "control" , id : "ControlLeft" , sub : "⌃" } ,
    { label : "option" , id : "OptionLeft" , sub : "⌥" } ,
    { label : "command" , id : "CmdLeft" , sub : "⌘" , wide : "cmd" } ,
    { label : "" , id : "Space" , wide : "space" } ,
    { label : "command" , id : "CmdRight" , sub : "⌘" , wide : "cmd" } ,
    { label : "option" , id : "OptionRight" , sub : "⌥" }
]

export default function HeroKeyboard({ activeKeys = [] , onKeyClick }) {
    const [tilt , setTilt] = useState({
        x : 0 ,
        y : 0
    })

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect()

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateY = ((mouseX - centerX) / centerX) * 8
        const rotateX = -((mouseY - centerY) / centerY) * 8

        setTilt({
            x : rotateX ,
            y : rotateY
        })
    }

    function resetTilt() {
        setTilt({
            x : 0 ,
            y : 0
        })
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="mt-4 perspective-[1800px]"
        >
            <div
                style={{
                    transform : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                }}
                className="keyboard-shell transition-transform duration-150 ease-out"
            >
                <div className="keyboard-content space-y-1.5">
                    {rows.map((row , rowIndex) => (
                        <div
                            key={rowIndex}
                            className="keyboard-row"
                        >
                            {row.map((item , keyIndex) => (
                                <KeyboardKey
                                    key={`${item.label}-${keyIndex}`}
                                    item={item}
                                    activeKeys={activeKeys}
                                    onKeyClick={onKeyClick}
                                />
                            ))}
                        </div>
                    ))}

                    <div className="keyboard-row">
                        {bottomLeftKeys.map((item , keyIndex) => (
                            <KeyboardKey
                                key={`${item.label}-${keyIndex}`}
                                item={item}
                                activeKeys={activeKeys}
                                onKeyClick={onKeyClick}
                            />
                        ))}

                        <KeyboardKey
                            item={{ label : "◀" , wide : "arrow" }}
                            activeKeys={activeKeys}
                            onKeyClick={onKeyClick}
                        />

                        <div className="flex w-11 flex-col gap-1">
                            <KeyboardKey
                                item={{ label : "▲" , wide : "arrowHalf" }}
                                activeKeys={activeKeys}
                                onKeyClick={onKeyClick}
                            />

                            <KeyboardKey
                                item={{ label : "▼" , wide : "arrowHalf" }}
                                activeKeys={activeKeys}
                                onKeyClick={onKeyClick}
                            />
                        </div>

                        <KeyboardKey
                            item={{ label : "▶" , wide : "arrow" }}
                            activeKeys={activeKeys}
                            onKeyClick={onKeyClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KeyboardKey({ item , activeKeys , onKeyClick }) {
    const keyId = item.id || item.label

    const isActive =
        activeKeys.includes(keyId) ||
        activeKeys.includes(item.label)

    return (
        <button
            onClick={() => onKeyClick?.(keyId)}
            className={`keyboard-key ${getKeyHeight(item.wide)} ${getKeyWidth(item.wide)} ${
                isActive ? "is-active" : ""
            }`}
        >
            <span className="keyboard-key-face" />

            <span className="keyboard-key-shine" />

            <span className="keyboard-key-label-wrap">
                {item.sub && (
                    <span className="keyboard-key-sub">
                        {item.sub}
                    </span>
                )}

                <span className={`keyboard-key-label ${getLabelClass(item)}`}>
                    {item.label}
                </span>
            </span>
        </button>
    )
}

function getKeyHeight(type) {
    if (type === "arrowHalf") return "h-[22px]"

    return "h-[48px]"
}

function getKeyWidth(type) {
    if (type === "delete") return "w-[67px]"
    if (type === "tab") return "w-[66px]"
    if (type === "caps") return "w-[92px]"
    if (type === "return") return "w-[80px]"
    if (type === "shiftLeft") return "w-[112px]"
    if (type === "shiftRight") return "w-[116px]"
    if (type === "cmd") return "w-[68px]"
    if (type === "space") return "w-[270px]"
    if (type === "arrow") return "w-[44px]"
    if (type === "arrowHalf") return "w-[44px]"

    return "w-[50px]"
}

function getLabelClass(item) {
    if (isSmallLabel(item.label)) {
        return "keyboard-key-small"
    }

    if (item.wide === "arrowHalf" || item.wide === "arrow") {
        return "keyboard-key-arrow"
    }

    return "keyboard-key-normal"
}

function isSmallLabel(label) {
    return [
        "delete" ,
        "tab" ,
        "caps lock" ,
        "return" ,
        "shift" ,
        "fn" ,
        "control" ,
        "option" ,
        "command"
    ].includes(label)
}