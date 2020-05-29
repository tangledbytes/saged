import React, { useState, useEffect, useCallback, useRef } from 'react'
import Classes from './index.module.css'
import Plus from '../../../assets/plus.svg'
import H1 from '../../../assets/heading.svg'
import H2 from '../../../assets/subheading.svg'
import Bq from '../../../assets/blockquote.svg'
import Ol from '../../../assets/unorderedlist.svg'
import Ul from '../../../assets/orderedlist.svg'
import Code from '../../../assets/code.svg'
import { getNodeFromKey } from '../utility'

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any
    editorRef: any
    toggleBlockStyle?: (blockType: string) => void
    offSetLeft?: number
    offSetTop?: number
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

const BLOCK_TYPES = [
    { label: <img className={Classes.icon} src={H1} />, style: 'header-one' },
    { label: <img className={Classes.icon} src={H2} />, style: 'header-two' },
    { label: <img className={Classes.icon} src={Bq} />, style: 'blockquote' },
    {
        label: <img className={Classes.icon} src={Ul} />,
        style: 'unordered-list-item'
    },
    {
        label: <img className={Classes.icon} src={Ol} />,
        style: 'ordered-list-item'
    },
    { label: <img className={Classes.icon} src={Code} />, style: 'atomic' }
]

const BlockStyleControls = (props: any) => {
    const { editorState } = props
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()

    return (
        <div className={Classes.controls}>
            {BLOCK_TYPES.map((type, idx) => (
                <StyleButton
                    key={`${type.style}-${idx}`}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    )
}
// ==================================== COMPONENT ===============================

function SideToolbar({
    editor,
    editorRef,
    toggleBlockStyle,
    offSetLeft = 2,
    offSetTop = 1
}: ToolbarConfig) {
    const [position, setPostion] = useState({ top: 0, left: 0 })
    const [show, setShow] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    /**
     * memoizedClickHandler handles the mouse clicks
     * Changes the state according to the location of
     * mouse click
     */
    const memoizedClickHandler = useCallback((ev: MouseEvent) => {
        if (ref.current?.contains(ev.target as Node)) return
        setShow(false)
    }, [])

    useEffect(() => {
        document.addEventListener('mousedown', memoizedClickHandler)

        return () =>
            document.removeEventListener('mousedown', memoizedClickHandler)
    }, [memoizedClickHandler])

    useEffect(() => {
        const selectionState = editor.getSelection()
        const start = selectionState.getStartKey()
        const currentContent = editor.getCurrentContent()
        const currentContentBlock = currentContent.getBlockForKey(start)

        const node = getNodeFromKey(
            currentContentBlock.getKey()
        ) as HTMLDivElement

        // let totalNodeHeight = node.clientHeight
        const computedStyle = window.getComputedStyle(node)
        const totalNodeHeight = parseInt(computedStyle.height)
        console.log(node.offsetTop)
        // if (computedStyle.marginTop && computedStyle.marginBottom) {
        //     totalNodeHeight +=
        //         parseInt(computedStyle.marginBottom) +
        //         parseInt(computedStyle.marginTop)
        // }

        setPostion({
            left: -(16 * offSetLeft),
            top: node.offsetTop + totalNodeHeight / 2 + 16 * offSetTop
        })
        // const prop = node.getBoundingClientRect()
        // console.log(prop, offSetLeft)

        // setPostion({
        //     top: prop.top + offSetTop * 0 + prop.height / 2,
        //     left: prop.left - offSetLeft * 16
        // })
    }, [editor, editorRef])

    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>
            <div
                className={Classes.iconContainer}
                onClick={() => setShow(!show)}
            >
                <img className={Classes.plusIcon} src={Plus} />
            </div>
            <div
                ref={ref}
                className={`${Classes.drawer} ${
                    !show ? Classes.hide : Classes.show
                }`}
            >
                <BlockStyleControls
                    editorState={editor}
                    onToggle={(blockStyle: string) => {
                        toggleBlockStyle && toggleBlockStyle(blockStyle)
                        setShow(false)
                    }}
                />
            </div>
        </div>
    )
}

export default SideToolbar
