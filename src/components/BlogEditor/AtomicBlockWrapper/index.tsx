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
    if (type === 'monaco') {
        return <CodeEditorWrapper {...props} />
    }

    return <MarkdownEditorWrapper {...props} />
}

export default AtomicBlockWrapper
