import React from 'react'
// eslint-disable-next-line no-unused-vars
import BlogEditor, { IBlogEditor } from './components/BlogEditor'

const Editor = (props: IBlogEditor): JSX.Element => {
    return <BlogEditor {...props} />
}

export default Editor
