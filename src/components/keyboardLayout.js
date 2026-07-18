export const rows = [
    [
        { label: "`" , sub: "~" } ,
        { label: "1" , sub: "!" } ,
        { label: "2" , sub: "@" } ,
        { label: "3" , sub: "#" } ,
        { label: "4" , sub: "$" } ,
        { label: "5" , sub: "%" } ,
        { label: "6" , sub: "^" } ,
        { label: "7" , sub: "&" } ,
        { label: "8" , sub: "*" } ,
        { label: "9" , sub: "(" } ,
        { label: "0" , sub: ")" } ,
        { label: "-" , sub: "_" } ,
        { label: "=" , sub: "+" } ,
        { label: "delete" , wide: "delete" }
    ] ,
    [
        { label: "tab" , wide: "tab" } ,
        { label: "Q" } , { label: "W" } , { label: "E" } , { label: "R" } , { label: "T" } ,
        { label: "Y" } , { label: "U" } , { label: "I" } , { label: "O" } , { label: "P" } ,
        { label: "[" , sub: "{" } ,
        { label: "]" , sub: "}" } ,
        { label: "\\" , sub: "|" }
    ] ,
    [
        { label: "caps lock" , wide: "caps" } ,
        { label: "A" } , { label: "S" } , { label: "D" } , { label: "F" } , { label: "G" } ,
        { label: "H" } , { label: "J" } , { label: "K" } , { label: "L" } ,
        { label: ";" , sub: ":" } ,
        { label: "'" , sub: '"' } ,
        { label: "return" , wide: "return" }
    ] ,
    [
        { label: "shift" , id: "ShiftLeft" , wide: "shiftLeft" } ,
        { label: "Z" } , { label: "X" } , { label: "C" } , { label: "V" } , { label: "B" } ,
        { label: "N" } , { label: "M" } ,
        { label: "," , sub: "<" } ,
        { label: "." , sub: ">" } ,
        { label: "/" , sub: "?" } ,
        { label: "shift" , id: "ShiftRight" , wide: "shiftRight" }
    ]
]

export const bottomLeftKeys = [
    { label: "fn" } ,
    { label: "control" , id: "ControlLeft" , sub: "⌃" } ,
    { label: "option" , id: "OptionLeft" , sub: "⌥" } ,
    { label: "command" , id: "CmdLeft" , sub: "⌘" , wide: "cmd" } ,
    { label: "" , id: "Space" , wide: "space" } ,
    { label: "command" , id: "CmdRight" , sub: "⌘" , wide: "cmd" } ,
    { label: "option" , id: "OptionRight" , sub: "⌥" }
]

export const arrowKeys = [
    { label: "◀" , wide: "arrow" } ,
    { label: "▲" , wide: "arrowHalf" } ,
    { label: "▼" , wide: "arrowHalf" } ,
    { label: "▶" , wide: "arrow" }
]
