import React, { Fragment } from 'react'
import CodeEditorWrapper from '../CodeEditorWrapper'
import MarkdownEditorWrapper from '../MarkdownEditorWrapper'

export interface IAtomicBlockWrapper {
    blockProps: any
    block: any
    contentState: any
}

function AtomicBlockWrapper(props: IAtomicBlockWrapper) {
    if (!props.block.getEntityAt(0)) return <Fragment />
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    const { type } = entity.getData()
    console.log(type)
    if (type === 'monaco') {
        return <CodeEditorWrapper {...props} />
    }

    return (
        <MarkdownEditorWrapper
            content={`# Hello World
            ### What's up?
            - Item 1
            - Item 2  
            HIIIII  
            **_HIIIII_**`}
            setEditorIsUp={props.blockProps.setEditorIsUp}
        />
    )
}

export default AtomicBlockWrapper
