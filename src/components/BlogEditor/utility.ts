export const getNodeFromKey = (key: string) => {
    return document.querySelectorAll(
        `[data-offset-key="${key}-0-0"]`
    )[0];
}

export const saveToLocalStorageHOF = () => {
    let timer: any;

    return ({ key = "article", content }: { key?: string, content: string }) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            const lstore = window.localStorage || localStorage;
            lstore.setItem(key, content);
        }, 300)
    }
}

export const retrieveFromLocalStorageHOF = () => {
    return ({ key }: { key: string }) => {
        const lstore = window.localStorage || localStorage;
        return lstore.getItem(key);
    }
}