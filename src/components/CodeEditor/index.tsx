import React, { useState, useRef, useEffect, Fragment } from 'react'
import Manoco from '@monaco-editor/react'
import { SUPPORTED_LANGUAGES } from './supportedLanguages'

import Classes from './index.module.css'

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
            <div className={Classes.editorBtnName}>{name}</div>
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
            <div className={Classes.slinputContainer}>
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
    onBlur,
    onFocus
}: EditorProps) {
    const [currentLanguage, setCurrentLanguage] = useState<string>(language)
    const [editable, setEditable] = useState<boolean>(!readOnly)
    const [displayOptions, setDisplayOptions] = useState<boolean>(false)

    const ref = useRef<any>(null)
    const currentLanguageRef = useRef<string>(currentLanguage)
    const languageSelectorRef = useRef<HTMLDivElement>(null)

    const setEditableHandler = () => setEditable(!editable)
    const setDisplayHandler = () => setDisplayOptions(!displayOptions)
    const setCurrentLanguageHandler = (language: string) => {
        currentLanguageRef.current = language
        setCurrentLanguage(language)
    }

    const handleMount = (_valueGetter: any, editor: any) => {
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
        <div className={className} style={{ height }}>
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
                    theme='dark'
                    editorDidMount={handleMount}
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
