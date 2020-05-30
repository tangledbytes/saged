import React, { useEffect, useState, useCallback, useRef } from 'react'
import Editor from '../../CodeEditor'

// =================================== INTERFACES ========================================

export interface ICodeEditorWrapper {
    blockProps: {
        language: string
        height: string
        readonly: boolean
        setEditorIsUp: (state: boolean) => void
        onFinishEdit: (contentState: any) => void
    }
    block: any
    contentState: any
}

// =================================== COMPONENTS =========================================

/**
 * A wrapper for the code editor
 * @param props
 */
const CodeEditorWrapper = (props: ICodeEditorWrapper) => {
    const { blockProps, block, contentState } = props
    const [init, setInit] = useState({
        code: '',
        language: blockProps.language
    })

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
                code: data.content,
                language: data.language
            }
            setInit(newState)
        }

        // eslint-disable-next-line
    }, [])

    /**
     * Memoized implementation of onBlur handler
     */
    const memoizedOnBlur = useCallback(() => {
        blockProps.setEditorIsUp(false)
    }, [blockProps])

    /**
     * Memoized implementation of onFocus handler
     */
    const memoizedOnFocus = useCallback(() => {
        blockProps.setEditorIsUp(true)
    }, [blockProps])

    return (
        <Editor
            header
            footer
            onChange={(code: string, language?: string) => {
                const entityKey = block.getEntityAt(0)
                const contentState = contentStateRef.current
                if (entityKey) {
                    const newContentState = contentState.mergeEntityData(
                        entityKey,
                        {
                            content: code,
                            language: language || blockProps.language
                        }
                    )
                    blockProps.onFinishEdit(newContentState)
                } else console.log('OOPS')
            }}
            code={init.code}
            onBlur={memoizedOnBlur}
            onFocus={memoizedOnFocus}
            language={init.language}
            height={blockProps.height}
            readOnly={blockProps.readonly}
        />
    )
}

export default CodeEditorWrapper
