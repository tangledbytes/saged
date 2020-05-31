import React from 'react'
import './index.css'
import Editor from 'saged'
import 'saged/dist/index.css'
import data from './data.json'

const content = JSON.stringify(data)

const Switch = (path) => {
    switch (true) {
        case path === '/saged/':
            return (
                <div className='editor'>
                    <Editor content={content} />
                </div>
            )
        case path === '/saged/#preview':
            return (
                <div className='editor'>
                    <Editor content={content} readonly />
                </div>
            )
        case path === '/saged/#editor':
            return (
                <div className='editor'>
                    <Editor />
                </div>
            )
        case path === '/saged/#editor/preview':
            return (
                <div className='editor'>
                    <Editor content={localStorage.getItem('item')} readonly />
                </div>
            )

        default:
            return (
                <div className='notfound-container'>
                    <div className='notfound-text'>404 - Page Not Found</div>
                </div>
            )
    }
}

const App = () => {
    const location = window.location.pathname + window.location.hash
    console.log(window.location)
    return (
        <div className='container'>
            {Switch(location)}
            <div className='btn-container'>
                <div>
                    <a href='/saged' className='btn'>
                        Editor
                    </a>
                </div>
                <div>
                    <a href='/saged/#preview' className='btn'>
                        Preview
                    </a>
                </div>
            </div>
        </div>
    )
}

export default App
