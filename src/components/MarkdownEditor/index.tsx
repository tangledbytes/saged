import React, { useRef, useEffect, useState } from 'react'
import { marked } from 'marked'
import DomPurify from 'dompurify'
import { createUseStyles } from 'react-jss'

// ============================================== INTERFACES =================================================
export interface IMarkdownEditor {
    content: string
    readonly?: boolean
    onFocus?: (e?: React.FocusEvent<HTMLDivElement>) => any
    onBlur?: (e?: React.FocusEvent<HTMLDivElement>) => any
    onMouseEnter?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
    onMouseLeave?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
    onChange?: (content?: string) => any
}

// ============================================== JSS STYLES ==================================================

const useStyles = createUseStyles({
    md: {
        fontSize: '1.2rem',
        color: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        textAlign: 'left',

        '&:empty': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',

            '&::before': {
                content: 'Start writing markdown...',
                color: 'rgba(0, 0, 0, 0.4)'
            }
        },
        '&:focus': {
            border: '1px solid #ccc'
        },
        '& *': {
            margin: '0.4rem 0'
        },

        // *************** HEADER ******************* //

        '& h1': {
            fontSize: '2.4rem',
            fontWeight: '500'
        },
        '& h2': {
            fontSize: '1.8rem',
            fontWeight: '500'
        },

        // **************** PARAGRAPH ************** //

        '& p': {
            fontSize: '1.21rem'
        },

        // **************** TABLE ******************* //
        '& table': {
            borderSpacing: 0,
            borderCollapse: 'collapse'
        },
        '& tr': {
            backgroundColor: '#fff',
            borderTop: '1px solid #c6cbd1'
        },
        '& th': {
            padding: '6px 13px',
            border: '1px solid #dfe2e5',
            fontWeight: 500
        },
        '& td': {
            padding: '6px 13px',
            border: '1px solid #dfe2e5',
            fontWeight: 'normal'
        },
        '& tr:nth-child(even)': {
            backgroundColor: '#f6f8fa'
        },

        // **************** BLOCKQUOTE ******************* //

        '& blockquote': {
            fontSize: '1.22rem',
            padding: '0.5rem 1.5rem',
            borderLeft: '3px solid #3eb0ef',
            display: 'flex',
            alignItems: 'center',

            '& p': {
                margin: 0
            }
        },

        // **************** LIST ******************* //

        '& ul': {
            fontSize: '1.21rem'
        },
        '& ol': {
            fontSize: '1.21rem'
        },

        // **************** IMAGES AND IFRAMES ******************* //

        '& img': {
            maxWidth: '100%'
        },
        '& iframe': {
            maxWidth: '100%'
        }
    }
})

// ============================================== COMPONENT ===================================================

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
    const Classes = useStyles()

    useEffect(() => {
        var effect = async () => {
            setValue(content || '')
            if (ref.current)
                ref.current.innerHTML = DomPurify.sanitize(
                    await marked(content || '')
                )
        }
        effect().catch((ex) => console.error(ex))
    }, [content])

    function focusHandler(e: React.FocusEvent<HTMLDivElement>) {
        if (ref.current) ref.current.innerHTML = value
        if (onFocus) onFocus(e)
    }

    async function blurHandler(e: React.FocusEvent<HTMLDivElement>) {
        if (ref.current)
            ref.current.innerHTML = DomPurify.sanitize(await marked(value))
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
