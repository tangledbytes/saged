import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import Bold from '../../svgs/bold'
import Italic from '../../svgs/italic'
import Underline from '../../svgs/underline'
import Wrapper from '../../svgs/Wrapper'

/**
 * @returns The selected area
 */
const getVisibleSelectionRect = () => {
    let target: DOMRect | null = null
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
    offsetTop?: number
    offsetLeft?: number
    editorPosition: {
        top: number
        left: number
    }
    toggleInlineStyle?: (inlineStyle: string) => void
    children?: any
}

interface IStyleButton {
    onToggle: (style: string) => void
    active: boolean
    style: string
    label: JSX.Element
}

// ==================================== JSS STYLES ==============================

const useStyles = createUseStyles({
    toolbarContainer: {
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        backgroundColor: 'white',
        boxShadow: '0 3px 15px -3px rgba(13, 20, 33, 0.13)',
        border: '1px solid #333',
        borderRadius: '0.4rem',
        zIndex: '100'
    },
    controls: {
        fontFamily: "'Helvetica', sans-serif",
        fontSize: '0.9rem',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.25rem 0.5rem'
    },
    styleButton: {
        color: 'black',
        cursor: 'pointer',
        padding: '0.2rem 0.3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeButton: {
        backgroundColor: '#ccc'
    },
    icon: {
        height: '1.21rem',
        width: '1.21rem'
    }
})

// ==================================== HELPER COMPONENT ========================

const StyleButton = ({ onToggle, active, style, label }: IStyleButton) => {
    const Classes = useStyles()

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

const InlineStyleControls = (props: any) => {
    const currentStyle = props.editorState.getCurrentInlineStyle()
    const Classes = useStyles()

    const INLINE_STYLES = [
        {
            label: <Wrapper className={Classes.icon} src={<Bold />} />,
            style: 'BOLD'
        },
        {
            label: <Wrapper className={Classes.icon} src={<Italic />} />,
            style: 'ITALIC'
        },
        {
            label: <Wrapper className={Classes.icon} src={<Underline />} />,
            style: 'UNDERLINE'
        }
    ]

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
    editorPosition,
    offsetTop = 2 + 0.5,
    offsetLeft = 2,
    toggleInlineStyle
}: ToolbarConfig) {
    const [position, setPostion] = useState(initialPosition)
    const Classes = useStyles()

    useEffect(() => {
        const selectionState = editor.getSelection()

        if (!selectionState.isCollapsed()) {
            const selectionRect = getVisibleSelectionRect()
            if (!selectionRect) return

            // The toolbar shouldn't be positioned directly on top of the selected text,
            // but rather with a small offset so the caret doesn't overlap with the text.
            const offsetTopRem = 16 * offsetTop
            const offsetLeftRem = 16 * offsetLeft
            const pageoffset =
                window.pageYOffset || document.documentElement.scrollTop

            setPostion({
                top:
                    selectionRect.top +
                    pageoffset -
                    editorPosition.top -
                    offsetTopRem,

                left:
                    selectionRect.left +
                    selectionRect.width / 2 -
                    editorPosition.left -
                    offsetLeftRem
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
