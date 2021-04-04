import React, { useState, useRef, useEffect, Fragment } from 'react'
import Manoco, {  } from '@monaco-editor/react'
import { SUPPORTED_LANGUAGES } from './supportedLanguages'

import { createUseStyles } from 'react-jss'

// =============================== INTERFACES =======================================

export interface EditorProps {
    language?: string
    code?: string
    readOnly?: boolean
    className?: string
    onChange?: (content: any, language?: string) => void
    header?: boolean
    footer?: boolean
    height?: string
    onBlur?: (event?: any) => void
    onFocus?: (event?: any) => void
    theme?: "vs-dark" | "light"
}

interface EditorBtnProps {
    onClick: (e: React.MouseEvent) => void
    name: string
    active: boolean
    setRef?: React.RefObject<HTMLDivElement>
    options?: boolean
}

interface SupportedLanguagesProps {
    onClick: (language: string) => void
    setDisplay: () => void
    interrupt: (
        e: MouseEvent,
        currentRef: React.RefObject<HTMLDivElement>
    ) => boolean
    onBlur?: (event?: any) => void
    onFocus?: (event?: any) => void
}

export interface ISupportedLanguageMap {
    [language: string]: {
        displayName: string
    }
}

// ========================================== CONSTANTS ===================================================

export { SUPPORTED_LANGUAGES }

// ========================================== JSS STYLES ====================================================

const useStyles = createUseStyles({
    editor: {
        height: '100%',
        width: '100%',
        position: 'relative',
        '& div': {
            boxSizing: 'border-box'
        }
    },
    head: {
        height: '2.25rem',
        backgroundColor: 'rgb(32, 33, 36)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '0.3rem 0.3rem 0 0',
        padding: '0 0.5rem'
    },
    cbtns: {
        borderRadius: '50%',
        height: '0.725rem',
        width: '0.725rem',
        margin: '0 0 0 0.5rem'
    },
    bottom: {
        backgroundColor: 'rgb(32, 33, 36)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: '0 0 0.3rem 0.3rem',
        padding: '0.25rem 0.5rem',
        height: '1.5rem'
    },
    editorBtn: {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: '0.8rem',
        marginRight: '1rem',
        cursor: 'pointer'
    },
    icon: {
        marginRight: '0.25rem',
        transform: 'rotate(0deg)',
        transition: 'transform 400ms'
    },
    active: {
        transform: 'rotate(180deg)',
        transition: 'transform 400ms'
    },
    SL: {
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    slinput: {
        outline: 'none',
        backgroundColor: '#2d2e35',
        color: 'white',
        padding: '0.5rem',
        border: '1px solid rgb(7, 131, 233)',
        borderRadius: '0.25rem',
        width: 'calc(100% - 1rem)',
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.6)'
        }
    },
    sllist: {
        maxHeight: '80%',
        color: 'white',
        overflowY: 'auto',
        padding: '0.75rem',
        backgroundColor: '#1e1e1e',
        boxShadow: '11px 13px 10px rgb(11, 13, 13, 0.4)',
        fontSize: '0.9rem',
        '& div': {
            marginTop: '0.5rem',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar': {
            width: '0.8rem'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#404040'
        }
    },
    option: {
        position: 'absolute',
        top: '3.5rem',
        zIndex: '5',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '0.25rem',
        width: '60%',
        height: '80%'
    }
})

// ========================================== COMPONENTS ====================================================

/**
 * EditorBtn renders the functional buttons present at the bottom of the
 * monaco editor
 * @param param0
 */
function EditorBtn({
    onClick,
    name,
    options = false,
    setRef,
    active = false
}: EditorBtnProps) {
    const Classes = useStyles()

    const onClickHander = (e: React.MouseEvent) => {
        onClick(e)
    }

    return (
        <div className={Classes.editorBtn} onClick={onClickHander} ref={setRef}>
            {options && (
                <div
                    className={[Classes.icon, active ? Classes.active : null]
                        .join(' ')
                        .trimEnd()}
                >
                    &#9650;
                </div>
            )}
            <div>{name}</div>
        </div>
    )
}

/**
 * SupportedLanguages componenet renders the supported languages
 * menu along with the search component
 * @param param0
 */
function SupportedLanguages({
    onClick,
    setDisplay,
    interrupt,
    onBlur,
    onFocus
}: SupportedLanguagesProps) {
    const [value, setValue] = useState<string>('')
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const Classes = useStyles()

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        if (inputRef.current) {
            inputRef.current.onfocus = (ev) => {
                if (onFocus) onFocus(ev)
            }

            inputRef.current.onblur = (ev) => {
                if (onBlur) onBlur(ev)
            }

            inputRef.current.focus()
        }

        return () => {
            return document.removeEventListener('mousedown', handleMouseDown)
        }

        // eslint-disable-next-line
    }, [])

    const handleMouseDown = (e: MouseEvent) => {
        if (interrupt(e, ref)) return undefined
        else setDisplay()
        return undefined
    }

    const onChange = (e: React.ChangeEvent) => {
        setValue((e.target as HTMLInputElement).value)
    }

    const onClickHander = (e: React.MouseEvent) => {
        onClick((e.target as HTMLDivElement).getAttribute('data-lid') as string)
    }

    return (
        <div className={Classes.SL} ref={ref}>
            <div style={{ width: "100%" }}>
                <input
                    ref={inputRef}
                    className={Classes.slinput}
                    placeholder='Set Language'
                    value={value}
                    onChange={onChange}
                />
            </div>
            <div className={Classes.sllist}>
                {Object.keys(SUPPORTED_LANGUAGES).map((sl, i) => {
                    const name = SUPPORTED_LANGUAGES[sl].displayName
                    if (value) {
                        if (
                            name
                                .toLocaleLowerCase()
                                .startsWith(value.toLocaleLowerCase())
                        )
                            return (
                                <div
                                    key={i}
                                    data-lid={sl}
                                    onClick={onClickHander}
                                >
                                    {name}
                                </div>
                            )
                    } else {
                        return (
                            <div key={i} data-lid={sl} onClick={onClickHander}>
                                {name}
                            </div>
                        )
                    }
                    return null
                })}
            </div>
        </div>
    )
}

/**
 * Header returns JSX for the header of the Monaco editor
 */
function Header() {
    const Classes = useStyles()

    return (
        <div className={Classes.head}>
            <div
                className={Classes.cbtns}
                style={{ backgroundColor: '#FF5F56' }}
            />
            <div
                className={Classes.cbtns}
                style={{ backgroundColor: '#FFBD2E' }}
            />
            <div
                className={Classes.cbtns}
                style={{ backgroundColor: '#27C93F' }}
            />
        </div>
    )
}

// =========================================== HELPER FUNCTION ===========================================

/**
 * getHeight returns the calcualated height for the editor
 * @param renderFooter
 * @param renderHeader
 */
function getHeight(renderFooter: boolean, renderHeader: boolean) {
    let height = 0
    const HEADER_HEIGHT = 2.25 // If height of header is changed in CSS then change it here also
    const FOOTER_HEIGHT = 1.5 // If height of footer is changed in CSS then change it here also

    if (renderFooter) height += FOOTER_HEIGHT

    if (renderHeader) height += HEADER_HEIGHT

    return height
}

// =========================================== COMPONENT =================================================

function CodeEditor({
    language = 'javascript',
    className,
    code = '',
    readOnly = false,
    onChange,
    footer = false,
    header = false,
    height = '20rem',
    theme = "vs-dark",
    onBlur,
    onFocus
}: EditorProps) {
    const [currentLanguage, setCurrentLanguage] = useState<string>(language)
    const [editable, setEditable] = useState<boolean>(!readOnly)
    const [displayOptions, setDisplayOptions] = useState<boolean>(false)

    const ref = useRef<any>(null)
    const currentLanguageRef = useRef<string>(currentLanguage)
    const containerRef = useRef<HTMLDivElement>(null)
    const languageSelectorRef = useRef<HTMLDivElement>(null)

    const Classes = useStyles()

    const setEditableHandler = () => setEditable(!editable)
    const setDisplayHandler = () => setDisplayOptions(!displayOptions)
    const setCurrentLanguageHandler = (language: string) => {
        currentLanguageRef.current = language
        setCurrentLanguage(language)
    }

    const handleMount = (editor: any) => {
        ref.current = editor
        ref.current.onDidBlurEditorText((ev: any) => {
            if (onBlur) onBlur(ev)
        })

        ref.current.onDidFocusEditorText((ev: any) => {
            if (onFocus) onFocus(ev)
        })

        if (typeof onChange === 'function') {
            ref.current.onDidChangeModelContent((_: any) => {
                onChange(ref.current.getValue(), currentLanguageRef.current)
            })
        }
    }

    const interrupt = (
        e: MouseEvent,
        currentRef: React.RefObject<HTMLDivElement>
    ) => {
        const currentNode = currentRef.current as Node
        const targetNode = e.target as Node
        if (
            (languageSelectorRef.current as Node).contains(targetNode) ||
            currentNode.contains(targetNode)
        )
            return true

        return false
    }

    useEffect(() => {
        setCurrentLanguageHandler(language)
    }, [language])

    return (
        <div className={className} style={{ height }} ref={containerRef}>
            <div className={Classes.editor}>
                {displayOptions && (
                    <div className={Classes.option}>
                        <SupportedLanguages
                            onBlur={onBlur}
                            onFocus={onFocus}
                            interrupt={interrupt}
                            onClick={setCurrentLanguageHandler}
                            setDisplay={setDisplayHandler}
                        />
                    </div>
                )}
                {header && <Header />}
                <Manoco
                    options={{ readOnly: !editable }}
                    value={code}
                    language={currentLanguage}
                    theme={theme}
                    onMount={handleMount}
                    height={`calc(100% - ${getHeight(footer, header)}rem)`}
                />
                {footer && (
                    <div className={Classes.bottom}>
                        {!readOnly && (
                            <Fragment>
                                <EditorBtn
                                    active={displayOptions}
                                    setRef={languageSelectorRef}
                                    onClick={setDisplayHandler}
                                    name={
                                        SUPPORTED_LANGUAGES[currentLanguage]
                                            .displayName
                                    }
                                    options
                                />
                                <EditorBtn
                                    active={false}
                                    onClick={setEditableHandler}
                                    name={`Edit: ${editable}`}
                                />
                            </Fragment>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CodeEditor
