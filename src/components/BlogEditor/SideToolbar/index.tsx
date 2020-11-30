import React, { useState, useEffect, useCallback, useRef } from 'react'
import Classes from './index.module.css'
import Plus from '../../svgs/plus'
import H1 from '../../svgs/heading'
import H2 from '../../svgs/subheading'
import Bq from '../../svgs/blockquote'
import Ul from '../../svgs/unorderedlist'
import Ol from '../../svgs/orderedlist'
import Code from '../../svgs/code'
import Md from '../../svgs/markdown'
import { getNodeFromKey } from '../utility'
import Wrapper from '../../svgs/Wrapper'

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any
    editorRef: any
    toggleBlockStyle?: (blockType: string, subType?: string) => void
    offSetLeft?: number
    offSetTop?: number
    children?: any
}

interface IStyleButton {
    onToggle: (style: string, subType?: string) => void
    active: boolean
    style: string
    label: JSX.Element
    subType?: string
}

// ==================================== HELPER COMPONENT ========================

const StyleButton = ({
    onToggle,
    active,
    style,
    label,
    subType
}: IStyleButton) => {
    const onToggleHandler = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.preventDefault()
        onToggle(style, subType)
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
    {
        label: <Wrapper className={Classes.icon} src={<H1 />} />,
        style: 'header-one'
    },
    {
        label: <Wrapper className={Classes.icon} src={<H2 />} />,
        style: 'header-two'
    },
    {
        label: <Wrapper className={Classes.icon} src={<Bq />} />,
        style: 'blockquote'
    },
    {
        label: <Wrapper className={Classes.icon} src={<Ul />} />,
        style: 'unordered-list-item'
    },
    {
        label: <Wrapper className={Classes.icon} src={<Ol />} />,
        style: 'ordered-list-item'
    },
    {
        label: <Wrapper className={Classes.icon} src={<Code />} />,
        style: 'atomic',
        subType: 'monaco'
    },
    {
        label: <Wrapper className={Classes.icon} src={<Md />} />,
        style: 'atomic',
        subType: 'markdown'
    }
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
                    subType={type.subType}
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

        const computedStyle = window.getComputedStyle(node)
        const totalNodeHeight = parseInt(computedStyle.height)

        setPostion({
            left: -(16 * offSetLeft),
            top:
                node.offsetTop +
                totalNodeHeight / 2 +
                16 * offSetTop -
                16 / 1.25
        })
    }, [editor, editorRef])

    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>
            <div
                className={Classes.iconContainer}
                onClick={() => setShow(!show)}
            >
                <Wrapper className={Classes.plusIcon} src={<Plus />} />
            </div>
            <div
                ref={ref}
                className={`${Classes.drawer} ${
                    !show ? Classes.hide : Classes.show
                }`}
            >
                <BlockStyleControls
                    editorState={editor}
                    onToggle={(blockStyle: string, subType?: string) => {
                        toggleBlockStyle &&
                            toggleBlockStyle(blockStyle, subType)
                        setShow(false)
                    }}
                />
            </div>
        </div>
    )
}

export default SideToolbar
