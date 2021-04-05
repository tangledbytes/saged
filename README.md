# saged

> saged is the editor used on blog.sagacious.dev site. It embeds draftjs and monaco right out of the box.

[![NPM](https://img.shields.io/npm/v/saged.svg)](https://www.npmjs.com/package/saged) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saged
```

## Features

1. WYSIWYG editor
2. Configurable
3. Comes with monaco editor (VS Code editor) baked in
4. Markdown support
5. Supports Server Side Rendering (Tested with Next.js) 🎉

## Usage

Using the defaults

```tsx
import React from 'react'

import Editor from 'saged'

function Editor() {
    return <Editor />
}
```

Configuring the editor

```tsx
import React from 'react'

import Editor from 'saged'
import Classes from './package.module.css'

function Editor() {
    return (
        <Editor
            content={localStorage.getItem('saged-example-item-eerTy443')}
            storageKey="some-random-key"
            className={Classes.editorOverride}
            readonly
        />
    )
}
```

## Props

1. readOnly (`boolean`): Specify if the editor should open in a read only mode. If opened in readonly mode then it will act as a previewer.
2. content (`string`): Content to be displayed by the text editor. This is supposed to follow the draftjs content schema and hence is not meant to be handled manually.
3. storageKey (`string`): Saged stores the content in the local storage. This key is used to store the data in local storage. Defaults to "article".
4. className (`string`): Override the default style of the editor container using this class name. Note that not all the styles can be overidden.
5. onChange (`(content: string) => void`): Optional function which will be invoked when editor state changes

## Caveats

1. Media uploads is not supported at the moment. Markdown should be used to embed such content.
2. Table is not supported yet, markdown should be used to embed such content.

## License

Apache 2.0 © [utkarsh-pro](https://github.com/utkarsh-pro)
