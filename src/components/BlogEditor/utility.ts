export const getNodeFromKey = (key: string) => {
    return document.querySelectorAll(`[data-offset-key="${key}-0-0"]`)[0]
}

export const getAbsolutePosition = (node: HTMLDivElement | null) => {
    if (node) {
        const offsetTop =
            window.pageYOffset || document.documentElement.scrollTop
        const offsetLeft =
            window.pageXOffset || document.documentElement.scrollLeft

        const rect = node.getBoundingClientRect()

        return {
            top: rect.top + offsetTop,
            left: rect.left + offsetLeft
        }
    }

    return { top: 0, left: 0 }
}

export const saveToLocalStorageHOF = () => {
    let timer: any

    return ({
        key = 'article',
        content
    }: {
        key?: string
        content: string
    }) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            const lstore = window.localStorage || localStorage
            lstore.setItem(key, content)
        }, 300)
    }
}

export const retrieveFromLocalStorageHOF = () => {
    return ({ key }: { key: string }) => {
        const lstore = window.localStorage || localStorage
        return lstore.getItem(key)
    }
}
