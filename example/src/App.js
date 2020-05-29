import React from 'react'
import './index.css'
import Editor from 'sag-editor'
import 'sag-editor/dist/index.css'

const App = () => {
    return (
        <div className='container'>
            <div className='editor'>
                <Editor />
            </div>
        </div>
    )
}

export default App
