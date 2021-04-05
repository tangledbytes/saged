export const getNodeFromKey = (key: string) => {
    return document?.querySelectorAll(`[data-offset-key="${key}-0-0"]`)[0]
}

export const getAbsolutePosition = (node: HTMLDivElement | null) => {
    if (node && window && document) {
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

// throttleHOF takes in a function and returns a throttling function
// which is throttled as per the timeout optionally given
export function throttleHOF<T>(func: (param: T) => void, timeout = 300): (param: T) => void {
    let timer: any

    return (param: T) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(param)
        }, timeout)
    }
}
