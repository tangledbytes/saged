import React, { useState, useCallback, useRef, useEffect } from 'react'
import AtomicBlockWrapper from './AtomicBlockWrapper'
import { createUseStyles } from 'react-jss'

import {
    Editor as DraftEditor,
    EditorState,
    AtomicBlockUtils,
    RichUtils,
    getDefaultKeyBinding,
    convertFromRaw,
    convertToRaw
} from 'draft-js'

import SideToolbar from './SideToolbar'
import InlineToolbar from './InlineToolbar'
import { getNodeFromKey, getAbsolutePosition } from './utility'
import Button from '../Button'

// ======================================== INTERFACES =============================================

/**
 * Interface for BlogEditor
 */
export interface IBlogEditor {
    readonly?: boolean
    content?: string
    storageKey?: string
    className?: string
    onChange?: (content: string) => void
}

// ========================================= JSS STYLES ============================================

const useStyles = createUseStyles({
    container: {
        height: '100%',
        width: '100%',
        boxSizing: 'border-box'
    },
    editMode: {
        backgroundColor: 'rgb(238, 245, 258)',
        padding: '2rem'
    },
    editor: {
        boxSizing: 'border-box',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        width: '100%',
        minHeight: '90vh',
        color: 'rgba(0, 0, 0, 0.8)',
        position: 'relative',
        '& *:first-child': {
            marginTop: 0
        }
    },
    editorH1: {
        fontSize: '2.4rem',
        fontWeight: '500',
        margin: '0.4rem 0'
    },
    editorH2: {
        fontSize: '1.8rem',
        fontWeight: 500,
        margin: '0.4rem 0'
    },
    editorText: {
        fontSize: '1.21rem',
        margin: '0.4rem 0'
    },
    editorBlockquote: {
        fontSize: '1.22rem',
        margin: '0.4rem 0',
        padding: '0.5rem 1.5rem',
        borderLeft: '3px solid #3eb0ef'
    },
    editorUL: {
        fontSize: '1.21rem',
        margin: '0.4rem 0'
    },
    editorOL: {
        fontSize: '1.21rem',
        margin: '0.4rem 0'
    },
    editorAtomic: {
        margin: '0.2rem 0'
    },
    btn: {
        margin: '2rem 1.5rem 0 0',
        fontSize: '1.2rem'
    }
})

// ========================================= HELPER FUNCTIONS =======================================

/**
 * serializeContentState serializes the content state into string
 * @param contentState
 */
const serializeContentState = (contentState: any) => {
    return JSON.stringify(convertToRaw(contentState))
}

/**
 * Receives the JSON object in string format
 * Parses it into object and the converts it into
 * a draft.js contentBlock
 * @param content
 */
const deserializeToContentState = (content: string) => {
    return convertFromRaw(JSON.parse(content))
}

/**
 * Looks for older content and passed in content
 * to initialize the state
 * @param content
 */
const initializeEditorState = ({ content }: { content?: string }) => {
    // If some content was passed in that initialize state from that
    if (content) {
        return EditorState.createWithContent(deserializeToContentState(content))
    }

    // If no content and older saved value was found then
    // initialize the state from an empty object
    return EditorState.createEmpty()
}

// =====================================================================================================

function BlogEditor({
    readonly,
    content,
    className,
    onChange
}: IBlogEditor) {
    /**
     * Stores the state of the editor
     */
    const [state, setState] = useState(
        initializeEditorState({ content })
    )

    const Classes = useStyles()

    /**
     * Stores the state if the code editor is active or not
     */
    const [editorIsUp, setEditorIsUp] = useState(false)

    /**
     * Reference to the draft editor
     */
    const DraftRef = useRef<DraftEditor>(null)

    const DraftContainerRef = useRef<HTMLDivElement>(null)

    /**
     * Memoized implementation of the renderer function
     */
    // @ts-ignore
    const memoizedBlockRendererFn = useCallback((block) => {
        const type = block.getType()
        if (type === 'atomic') {
            return {
                component: AtomicBlockWrapper,
                editable: false,
                props: {
                    language: 'javascript',
                    height: '20rem',
                    readonly,
                    setEditorIsUp,
                    onFinishEdit: (newContentState: any) => {
                        setState(EditorState.createWithContent(newContentState))
                    }
                }
            }
        }
    }, [])

    /**
     * Assigns custom classes to the draft js blocks
     * @param ContentBlock
     */
    const blockStyleFn = (ContentBlock: any) => {
        const type = ContentBlock.getType()
        switch (type) {
            case 'header-one':
                return Classes.editorH1
            case 'header-two':
                return Classes.editorH2
            case 'blockquote':
                return Classes.editorBlockquote
            case 'ordered-list-item':
                return Classes.editorOL
            case 'unordered-list-item':
                return Classes.editorUL
            case 'atomic':
                return Classes.editorAtomic
            default:
                return Classes.editorText
        }
    }

    useEffect(() => {
        const content = serializeContentState(state.getCurrentContent())
        onChange?.(content)
    }, [state, onChange])

    /**
     * toggleInlineStyle toggles the inline style
     * for the draftjs blocks
     * @param inlineStyle
     */
    const toggleInlineStyle = (inlineStyle: string) => {
        setState(RichUtils.toggleInlineStyle(state, inlineStyle))
    }

    /**
     * Handler for toggling the block type
     * Has additional implementation to modify the
     * behaviour of the custom code editor
     *
     * It ensures that the draft wrapper around the code
     * editor has set contentEditable to false.
     *
     * NOTE: Not doing so will create problems like
     * draft taking control over the input on code editor!
     * @param blockType
     */
    const toggleBlockType = (blockType: string, subType?: string) => {
        if (blockType !== 'atomic')
            setState(RichUtils.toggleBlockType(state, blockType))
        else {
            // Add atomic to the current state
            const contentState = state.getCurrentContent()
            const contentStateWithEntity = contentState.createEntity(
                'ATOMIC',
                'IMMUTABLE',
                { type: subType }
            )
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorState = EditorState.set(state, {
                currentContent: contentStateWithEntity
            })
            const newState = AtomicBlockUtils.insertAtomicBlock(
                newEditorState,
                entityKey,
                ' '
            )
            setState(newState)

            // Get a reference to atomic instance
            const newContentState = newState.getCurrentContent()
            const draftKey = newContentState.getLastBlock().getKey()
            const atomicKey = newContentState.getKeyBefore(draftKey)

            // Get the atomic node
            // This is done asynchronously because
            // There is usually a delay between block rendering by
            // Draft js
            setTimeout(() => {
                const atomicParent = getNodeFromKey(atomicKey)

                const divReferenceToAtomicParent = atomicParent as HTMLDivElement
                if (divReferenceToAtomicParent)
                    divReferenceToAtomicParent.contentEditable = 'false'
            }, 0)
        }
    }

    /**
     * onChangeHandler wraps setState
     * @param state
     */
    const onChangeHandler = (state: EditorState) => setState(state)

    /**
     * focus function handles the focus on the draft editor
     */
    const focus = () => {
        if (!readonly && DraftRef.current) DraftRef.current.focus()
    }

    /**
     * Handles the basic key commands on the editor
     * @param command
     * @param editorState
     */
    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setState(newState)
            return true
        }
        return false
    }

    /**
     * Assigns speacial key mapping on the editor
     * @param e
     */
    const mapKeyToEditorCommand = (e: any) => {
        // Change tab functionality
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(e, state, 4 /* maxDepth */)
            if (newEditorState !== state) {
                setState(newEditorState)
            }
            return
        }

        return getDefaultKeyBinding(e)
    }

    return (
        <div
            ref={DraftContainerRef}
            className={`${Classes.container} ${!readonly && Classes.editMode}`}
        >
            <div
                className={[Classes.editor, className].join(' ')}
                onClick={focus}
            >
                {!readonly && (
                    <SideToolbar
                        offSetLeft={1}
                        offSetTop={1}
                        editor={state}
                        editorRef={DraftRef}
                        toggleBlockStyle={toggleBlockType}
                    />
                )}
                {!readonly && (
                    <InlineToolbar
                        editorPosition={getAbsolutePosition(
                            DraftContainerRef.current
                        )}
                        editor={state}
                        editorRef={DraftRef}
                        toggleInlineStyle={toggleInlineStyle}
                    />
                )}
                {/* Adding this because of incompatible types
                // @ts-ignore */}
                <DraftEditor
                    spellCheck
                    ref={DraftRef}
                    readOnly={readonly || editorIsUp}
                    editorState={state}
                    onChange={onChangeHandler}
                    blockStyleFn={blockStyleFn}
                    keyBindingFn={mapKeyToEditorCommand}
                    // @ts-ignore
                    handleKeyCommand={handleKeyCommand}
                    blockRendererFn={memoizedBlockRendererFn}
                />
            </div>
            {!readonly && (
                <Button
                    name='Show data'
                    onClick={() => console.log(state.toJS())}
                    className={Classes.btn}
                />
            )}
        </div>
    )
}

export default BlogEditor
