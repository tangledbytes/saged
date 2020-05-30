import React, { useRef, useState, useEffect } from 'react'
import MarkdownEditor from '../../MarkdownEditor'

export interface IMarkdownEditorWrapper {
    blockProps: {
        readonly: boolean
        content: string
        setEditorIsUp: (state: boolean) => void
        onFinishEdit: (contentState: any) => void
    }
    block: any
    contentState: any
}

function MarkdownEditorWrapper(props: IMarkdownEditorWrapper) {
    const { blockProps, block, contentState } = props
    const [init, setInit] = useState({
        content: ''
    })

    const editorIsFocused = useRef<boolean>(false)
    const editorIsActive = useRef<boolean>(false)

    // Had to hold a reference to the latest value of contentstate
    // as for some reason the callback functions were getting stale
    // value of the this prop
    const contentStateRef = useRef<any>(contentState)
    contentStateRef.current = contentState

    // This sets the initial code while also making sure
    // that no "code" prop of the Editor is not
    // directly associated with a wrapper prop
    // Hence it avoids rerenders on each click
    useEffect(() => {
        const entityKey = block.getEntityAt(0)
        if (entityKey) {
            const data = contentState.getEntity(entityKey)?.getData()
            const newState = {
                content: data.content
            }
            setInit(newState)
        }

        // eslint-disable-next-line
    }, [])

    function updateEditorState() {
        if (editorIsFocused.current) blockProps.setEditorIsUp(true)
        else if (!editorIsFocused.current) blockProps.setEditorIsUp(false)
    }

    return (
        <MarkdownEditor
            content={init.content}
            readonly={blockProps.readonly}
            onFocus={() => {
                editorIsFocused.current = true
                updateEditorState()
            }}
            onBlur={() => {
                editorIsFocused.current = false
                updateEditorState()
            }}
            onMouseEnter={() => {
                editorIsActive.current = true
                updateEditorState()
            }}
            onMouseLeave={() => {
                editorIsActive.current = false
                updateEditorState()
            }}
            onChange={(content) => {
                const entityKey = block.getEntityAt(0)
                console.log(entityKey)
                const contentState = contentStateRef.current
                if (entityKey) {
                    console.log(content)
                    const newContentState = contentState.mergeEntityData(
                        entityKey,
                        {
                            content: content
                        }
                    )
                    blockProps.onFinishEdit(newContentState)
                } else console.log('OOPS MARKDOWN')
            }}
        />
    )
}

export default MarkdownEditorWrapper
