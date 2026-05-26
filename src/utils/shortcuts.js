const modifierKeys = ["cmd" , "shift" , "ctrl" , "control" , "option" , "alt"]

const keyLabels = {
    CmdLeft : "Cmd" ,
    CmdRight : "Cmd" ,
    OptionLeft : "Option" ,
    OptionRight : "Option" ,
    ShiftLeft : "Shift" ,
    ShiftRight : "Shift" ,
    ControlLeft : "Ctrl" ,
    ControlRight : "Ctrl"
}

const sortOrder = {
    ControlLeft : 1 ,
    ControlRight : 1 ,
    OptionLeft : 2 ,
    OptionRight : 2 ,
    CmdLeft : 3 ,
    CmdRight : 3 ,
    ShiftLeft : 4 ,
    ShiftRight : 4
}

export function getShortcutsFromApps(apps = []) {
    return apps.flatMap((app) =>
        (app.shortcuts || []).map((shortcut) => ({
            ...shortcut ,
            app : app.name ,
            appId : app.id
        }))
    )
}

export function formatKey(key) {
    return keyLabels[key] || key
}

export function sortShortcutKeys(keys = []) {
    return [...keys].sort((a , b) => {
        const aOrder = sortOrder[a] || 10
        const bOrder = sortOrder[b] || 10

        if (aOrder !== bOrder) return aOrder - bOrder

        return a.localeCompare(b)
    })
}

export function formatShortcut(keys = []) {
    return sortShortcutKeys(keys).map(formatKey).join(" + ")
}

export function normalizeSearch(text = "") {
    return text
        .toLowerCase()
        .replaceAll("command" , "cmd")
        .replaceAll("control" , "ctrl")
        .replaceAll("option" , "alt")
        .replaceAll("+" , " ")
        .replaceAll("-" , " ")
        .replaceAll("," , " ")
        .replace(/\s+/g , " ")
        .trim()
}

export function getQueryWords(query) {
    return normalizeSearch(query).split(" ").filter(Boolean)
}

export function matchesShortcutSearch(shortcut , queryWords) {
    if (queryWords.length === 0) return true

    const searchableText = getSearchText(shortcut)
    const shortcutWords = formatShortcut(shortcut.keys)
        .toLowerCase()
        .replaceAll("command" , "cmd")
        .replaceAll("control" , "ctrl")
        .replaceAll("option" , "alt")
        .replaceAll("+" , " ")
        .split(" ")
        .filter(Boolean)

    const queryHasModifier = queryWords.some((word) =>
        modifierKeys.includes(word)
    )

    return queryWords.every((word) => {
        if (modifierKeys.includes(word)) {
            return shortcutWords.includes(word)
        }

        if (queryHasModifier && word.length === 1) {
            return shortcutWords.includes(word)
        }

        return searchableText.includes(word)
    })
}

function getSearchText(shortcut) {
    const readableKeys = formatShortcut(shortcut.keys)
    const compactKeys = readableKeys.replaceAll(" + " , " ")

    return normalizeSearch(`
        ${shortcut.app}
        ${shortcut.title}
        ${shortcut.description || ""}
        ${(shortcut.keys || []).map(formatKey).join(" ")}
        ${readableKeys}
        ${compactKeys}
    `)
}
