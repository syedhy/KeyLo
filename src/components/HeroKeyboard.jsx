const rows = [
    [
        { label : "Esc" } , { label : "1" } , { label : "2" } , { label : "3" } , { label : "4" } , { label : "5" } ,
        { label : "6" } , { label : "7" } , { label : "8" } , { label : "9" } , { label : "0" } , { label : "-" } , { label : "=" }
    ] ,
    [
        { label : "Tab" , wide : "tab" } , { label : "Q" } , { label : "W" } , { label : "E" } , { label : "R" } ,
        { label : "T" } , { label : "Y" } , { label : "U" } , { label : "I" } , { label : "O" } , { label : "P" } ,
        { label : "[" } , { label : "]" }
    ] ,
    [
        { label : "Caps" , wide : "caps" } , { label : "A" } , { label : "S" } , { label : "D" } , { label : "F" } ,
        { label : "G" } , { label : "H" } , { label : "J" } , { label : "K" } , { label : "L" } , { label : ";" } , { label : "'" }
    ] ,
    [
        { label : "Shift" , id : "ShiftLeft" , wide : "shift" } , { label : "Z" } , { label : "X" } , { label : "C" } ,
        { label : "V" } , { label : "B" } , { label : "N" } , { label : "M" } , { label : "," } , { label : "." } ,
        { label : "/" } , { label : "Shift" , id : "ShiftRight" , wide : "shift" }
    ] ,
    [
        { label : "Fn" } ,
        { label : "Control" , id : "ControlLeft" , wide : "modifier" } ,
        { label : "Option" , id : "OptionLeft" , wide : "modifier" } ,
        { label : "Cmd" , id : "CmdLeft" , wide : "cmd" } ,
        { label : "Space" , wide : "space" } ,
        { label : "Cmd" , id : "CmdRight" , wide : "cmd" } ,
        { label : "Option" , id : "OptionRight" , wide : "modifier" }
    ]
]

export default function HeroKeyboard({ activeKeys = [] , onKeyClick }) {
    return (
        <div className="mx-auto mt-10 max-w-6xl">
            <div className="rounded-[2rem] border border-[#2a2a24] bg-[#171914] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-7">
                <div className="space-y-2 md:space-y-3">
                    {rows.map((row , rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-2 md:gap-3">
                            {row.map((key , keyIndex) => {
                                const keyId = key.id || key.label
                                const isActive = activeKeys.includes(keyId) || activeKeys.includes(key.label)

                                return (
                                    <button
                                        key={`${keyId}-${keyIndex}`}
                                        onClick={() => onKeyClick?.(keyId)}
                                        className={`h-12 rounded-xl border text-sm font-medium transition-all duration-200 md:h-16 ${getKeyWidth(key.wide)
                                            } ${isActive
                                                ? "border-[#9fbd88] bg-[#9fbd88] text-[#11140f] shadow-[0_0_30px_rgba(159,189,136,0.45)] -translate-y-1"
                                                : "border-[#34372e] bg-[#22251d] text-[#d8d2c2] shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)] hover:bg-[#2b2f25]"
                                            }`}
                                    >
                                        {key.label}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function getKeyWidth(type) {
    if (type === "space") return "w-52 md:w-96"
    if (type === "shift") return "w-24 md:w-32"
    if (type === "caps") return "w-20 md:w-28"
    if (type === "tab") return "w-16 md:w-24"
    if (type === "modifier") return "w-20 md:w-28"
    if (type === "cmd") return "w-16 md:w-24"
    return "w-12 md:w-16"
}