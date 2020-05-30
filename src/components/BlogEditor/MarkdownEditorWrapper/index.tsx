import React, { useRef, useEffect, useState } from 'react'
import marked from 'marked'
import Classes from './index.module.css'

let editorIsFocused = false
let editorIsActive = false

function MarkdownEditorWrapper({
    content,
    setEditorIsUp
}: {
    content: string
    setEditorIsUp: (state: boolean) => any
}) {
    const [value, setValue] = useState<string>(content)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) ref.current.innerHTML = marked(value)
    }, [])

    function updateEditorState() {
        if (editorIsFocused && editorIsActive) setEditorIsUp(true)
        else setEditorIsUp(false)
    }

    return (
        <div
            contentEditable
            ref={ref}
            className={Classes.md}
            onFocus={() => {
                console.log('FOCUSED')
                editorIsFocused = true
                if (ref.current) ref.current.innerHTML = value
                updateEditorState()
            }}
            onBlur={() => {
                console.log('BLURRED')
                editorIsFocused = false
                if (ref.current) ref.current.innerHTML = marked(value)
                updateEditorState()
            }}
            onMouseEnter={() => {
                editorIsActive = true
                console.log('WOHOOO')
                updateEditorState()
            }}
            onMouseLeave={() => {
                console.log('BYEEE')
                editorIsActive = false
                updateEditorState()
            }}
            onInput={() => setValue(ref.current?.innerText || '')}
        />
    )
}

export default MarkdownEditorWrapper
