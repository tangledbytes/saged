import React, { useRef, useEffect, useState } from 'react'
import marked from 'marked'
import DomPurify from 'dompurify'
import Classes from './index.module.css'

export interface IMarkdownEditor {
    content: string
    readonly?: boolean
    onFocus?: (e?: React.FocusEvent<HTMLDivElement>) => any
    onBlur?: (e?: React.FocusEvent<HTMLDivElement>) => any
    onMouseEnter?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
    onMouseLeave?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
    onChange?: (content?: string) => any
}

function MarkdownEditorWrapper({
    content,
    readonly,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onChange
}: IMarkdownEditor) {
    const [value, setValue] = useState<string>(content || '')

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setValue(content || '')
        if (ref.current)
            ref.current.innerHTML = DomPurify.sanitize(marked(content || ''))
    }, [content])

    function focusHandler(e: React.FocusEvent<HTMLDivElement>) {
        if (ref.current) ref.current.innerHTML = value
        if (onFocus) onFocus(e)
    }

    function blurHandler(e: React.FocusEvent<HTMLDivElement>) {
        if (ref.current)
            ref.current.innerHTML = DomPurify.sanitize(marked(value))
        if (onBlur) onBlur(e)
    }

    function inputHander() {
        setValue(ref.current?.innerText || '')
        if (onChange) onChange(ref.current?.innerText)
    }

    return (
        <div
            contentEditable={!readonly}
            ref={ref}
            className={Classes.md}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onInput={inputHander}
        />
    )
}

export default MarkdownEditorWrapper
