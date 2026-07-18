import { useState } from "react"
import "../styles/keyboard.css"

import {
    arrowKeys ,
    bottomLeftKeys ,
    rows
} from "./keyboardLayout"

export default function HeroKeyboard({
    activeKeys = [] ,
    compact = false ,
    density = "default" ,
    onKeyClick
}) {
    const [tilt, setTilt] = useState({
        x: 0,
        y: 0
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
            x: rotateX,
            y: rotateY
        })
    }

    function resetTilt() {
        setTilt({
            x: 0,
            y: 0
        })
    }

    const densityClass =
        compact || density === "compact"
            ? "keyboard-viewport--compact"
            : density === "home"
                ? "keyboard-viewport--home"
                : density === "detail"
                    ? "keyboard-viewport--detail"
                    : density === "editor"
                        ? "keyboard-viewport--editor"
                        : ""

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className={`keyboard-viewport ${densityClass}`}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                }}
                className="keyboard-shell transition-transform duration-150 ease-out"
            >
                <div className="keyboard-content">
                    {rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="keyboard-row"
                        >
                            {row.map((item, keyIndex) => (
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
                            item={arrowKeys[0]}
                            activeKeys={activeKeys}
                            onKeyClick={onKeyClick}
                        />

                        <div className="keyboard-arrow-stack">
                            <KeyboardKey
                                item={arrowKeys[1]}
                                activeKeys={activeKeys}
                                onKeyClick={onKeyClick}
                            />

                            <KeyboardKey
                                item={arrowKeys[2]}
                                activeKeys={activeKeys}
                                onKeyClick={onKeyClick}
                            />
                        </div>

                        <KeyboardKey
                            item={arrowKeys[3]}
                            activeKeys={activeKeys}
                            onKeyClick={onKeyClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KeyboardKey({ item, activeKeys, onKeyClick }) {
    const keyId = item.id || item.label

    const isActive =
        activeKeys.includes(keyId) ||
        activeKeys.includes(item.label)

    return (
        <button
            type="button"
            onClick={() => onKeyClick?.(keyId)}
            className={`keyboard-key ${isActive ? "is-active" : ""}`}
            style={{
                "--key-width" : getKeyWidth(item.wide) ,
                "--key-height-ratio" : getKeyHeight(item.wide)
            }}
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
    if (type === "arrowHalf") return 0.46

    return 1
}

function getKeyWidth(type) {
    const widths = {
        delete : 1.34 ,
        tab : 1.32 ,
        caps : 1.84 ,
        return : 1.6 ,
        shiftLeft : 2.24 ,
        shiftRight : 2.32 ,
        cmd : 1.14 ,
        space : 5.86 ,
        arrow : 0.88 ,
        arrowHalf : 0.88
    }

    return widths[type] || 1
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
        "delete",
        "tab",
        "caps lock",
        "return",
        "shift",
        "fn",
        "control",
        "option",
        "command"
    ].includes(label)
}
