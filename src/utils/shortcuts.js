const modifierKeys = ["cmd" , "shift" , "ctrl" , "control" , "option" , "alt" , "meta"]

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

const searchFieldWeights = {
    app : {
        exact : 18 ,
        prefix : 14 ,
        contains : 7 ,
        full : 12
    } ,
    title : {
        exact : 24 ,
        prefix : 18 ,
        contains : 9 ,
        full : 18
    } ,
    description : {
        exact : 10 ,
        prefix : 6 ,
        contains : 3 ,
        full : 6
    } ,
    keys : {
        exact : 28 ,
        prefix : 22 ,
        contains : 14 ,
        full : 24
    } ,
    keyLabels : {
        exact : 16 ,
        prefix : 12 ,
        contains : 8 ,
        full : 12
    }
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
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g , "")
        .replaceAll("⌘" , " cmd ")
        .replaceAll("⌃" , " ctrl ")
        .replaceAll("⌥" , " alt ")
        .replaceAll("⇧" , " shift ")
        .replace(/\bcommand\b/g , " cmd ")
        .replace(/\bcontrol\b/g , " ctrl ")
        .replace(/\boption\b/g , " alt ")
        .replace(/\bmeta\b/g , " meta ")
        .replace(/[^\p{L}\p{N}]+/gu , " ")
        .replace(/\s+/g , " ")
        .trim()
}

export function getQueryWords(query) {
    return normalizeSearch(query).split(" ").filter(Boolean)
}

export function searchShortcuts(shortcuts = [] , query = "" , { limit } = {}) {
    const queryWords = getQueryWords(query)

    if (queryWords.length === 0) {
        return typeof limit === "number" ? shortcuts.slice(0 , limit) : shortcuts.slice()
    }

    return shortcuts
        .map((shortcut) => ({
            score : scoreShortcut(shortcut , queryWords) ,
            shortcut
        }))
        .filter(({ score }) => score > 0)
        .sort((a , b) => {
            if (b.score !== a.score) {
                return b.score - a.score
            }

            return a.shortcut.title.localeCompare(b.shortcut.title)
        })
        .slice(0 , typeof limit === "number" ? limit : undefined)
        .map(({ shortcut }) => shortcut)
}

export function scoreShortcut(shortcut , queryWords = []) {
    if (queryWords.length === 0) {
        return 1
    }

    const index = buildSearchIndex(shortcut)
    const queryHasModifier = queryWords.some((word) => modifierKeys.includes(word))

    let score = 0

    score += scoreField(index.app , queryWords , searchFieldWeights.app , queryHasModifier , false)
    score += scoreField(index.title , queryWords , searchFieldWeights.title , queryHasModifier , false)
    score += scoreField(index.description , queryWords , searchFieldWeights.description , queryHasModifier , false)
    score += scoreField(index.keys , queryWords , searchFieldWeights.keys , queryHasModifier , true)
    score += scoreField(index.keyLabels , queryWords , searchFieldWeights.keyLabels , queryHasModifier , true)

    if (queryWords.every((word) => index.searchable.includes(word))) {
        score += 8
    }

    if (queryWords.every((word) => index.keys.includes(word) || index.keyLabels.includes(word))) {
        score += 20
    }

    if (queryWords.join(" ") === index.keys) {
        score += 24
    }

    if (queryWords.join(" ") === index.keyLabels) {
        score += 16
    }

    return score
}

export function matchesShortcutSearch(shortcut , queryWords) {
    return scoreShortcut(shortcut , queryWords) > 0
}

function buildSearchIndex(shortcut) {
    const keyLabelsText = (shortcut.keys || []).map(formatKey).join(" ")
    const readableKeys = formatShortcut(shortcut.keys)

    return {
        app : normalizeSearch(shortcut.app) ,
        description : normalizeSearch(shortcut.description || "") ,
        keyLabels : normalizeSearch(keyLabelsText) ,
        keys : normalizeSearch(readableKeys) ,
        searchable : normalizeSearch(`
            ${shortcut.app || ""}
            ${shortcut.title || ""}
            ${shortcut.description || ""}
            ${readableKeys}
            ${keyLabelsText}
        `) ,
        title : normalizeSearch(shortcut.title)
    }
}

function scoreField(field , queryWords , weights , queryHasModifier , keysField) {
    if (!field) {
        return 0
    }

    let score = 0
    let matchedWords = 0

    for (const word of queryWords) {
        if (!word) continue

        if (queryHasModifier && word.length === 1 && !keysField) {
            continue
        }

        if (field === word) {
            score += weights.exact
            matchedWords += 1
            continue
        }

        if (field.startsWith(word)) {
            score += weights.prefix
            matchedWords += 1
            continue
        }

        if (field.includes(word)) {
            score += weights.contains
            matchedWords += 1
        }
    }

    if (matchedWords === queryWords.length) {
        score += weights.full
    }

    return score
}
