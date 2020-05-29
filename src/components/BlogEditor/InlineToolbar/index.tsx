import React, { useState, useEffect } from 'react'
import Classes from './index.module.css'
import Bold from '../../../assets/bold.svg'
import Italic from '../../../assets/italic.svg'
import Underline from '../../../assets/underline.svg'

/**
 * @returns The selected area
 */
const getVisibleSelectionRect = () => {
    let target: any = null
    // Putting it into try catch block because I observed a weird error
    // Error: getRangeAt(0): 0 is not a valid index
    // Couldn't replicate the error
    try {
        const selection = window.getSelection()?.getRangeAt(0).getClientRects()

        if (selection?.length) {
            if (selection[0].width === 0) target = selection[1]
            else target = selection[0]
        }
    } catch (error) {
        console.error(error)
    }

    return target
}

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any
    editorRef: any
    toggleInlineStyle?: (inlineStyle: string) => void
    children?: any
}

interface IStyleButton {
    onToggle: (style: string) => void
    active: boolean
    style: string
    label: JSX.Element
}

// ==================================== HELPER COMPONENT ========================

const StyleButton = ({ onToggle, active, style, label }: IStyleButton) => {
    const onToggleHandler = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.preventDefault()
        onToggle(style)
    }

    let className = Classes.styleButton
    if (active) {
        className += ' ' + Classes.activeButton
    }

    return (
        <span className={className} onMouseDown={onToggleHandler}>
            {label}
        </span>
    )
}

const INLINE_STYLES = [
    { label: <img className={Classes.icon} src={Bold} />, style: 'BOLD' },
    { label: <img className={Classes.icon} src={Italic} />, style: 'ITALIC' },
    {
        label: <img className={Classes.icon} src={Underline} />,
        style: 'UNDERLINE'
    }
]

const InlineStyleControls = (props: any) => {
    const currentStyle = props.editorState.getCurrentInlineStyle()

    return (
        <div className={Classes.controls}>
            {INLINE_STYLES.map((type, idx) => (
                <StyleButton
                    key={`inline-style-${idx}`}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    )
}

// ==================================== CONSTANTS ===============================

const initialPosition = { top: -100, left: -100 }

// ==================================== COMPONENT ===============================

function InlineToolbar({
    editor,
    editorRef,
    toggleInlineStyle
}: ToolbarConfig) {
    const [position, setPostion] = useState(initialPosition)

    useEffect(() => {
        const selectionState = editor.getSelection()

        if (!selectionState.isCollapsed()) {
            const selectionRect = getVisibleSelectionRect()

            if (!selectionRect) return

            // The toolbar shouldn't be positioned directly on top of the selected text,
            // but rather with a small offset so the caret doesn't overlap with the text.
            const offset = 16 * 0.5
            const offsetTop =
                window.pageYOffset || document.documentElement.scrollTop

            setPostion({
                top: selectionRect.top + offsetTop - offset,

                left: selectionRect.left + selectionRect.width / 2
            })
        } else {
            setPostion(initialPosition)
        }
    }, [editor, editorRef])

    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>
            {position.top !== initialPosition.top && (
                <InlineStyleControls
                    editorState={editor}
                    onToggle={toggleInlineStyle}
                />
            )}
        </div>
    )
}

export default InlineToolbar
