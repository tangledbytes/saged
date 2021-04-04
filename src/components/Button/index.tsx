import React from 'react'
import { createUseStyles } from 'react-jss'

// ===================================== INTERFACES ========================================

export interface LoginProps {
    name: string
    className?: string
    onClick?: (event: React.MouseEvent) => void
}

// ===================================== JSS STYLES ========================================

const useStyles = createUseStyles({
    btn: {
        padding: '0.25rem 0.5rem',
        outline: 'none',
        border: '1px solid #6212B2',
        backgroundColor: 'white',
        borderRadius: '0.2rem',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 200ms ease-in-out',
        fontSize: 'inherit',
        '&:hover': {
            backgroundColor: '#6212B2',
            color: 'white'
        }
    }
})

// ===================================== COMPONENT =========================================

function Button({ name, className, onClick }: LoginProps) {
    const Classes = useStyles()

    return (
        <button
            onClick={onClick}
            className={[Classes.btn, className].join(' ')}
        >
            {name}
        </button>
    )
}

export default Button
