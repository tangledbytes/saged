import React, { MouseEvent } from 'react'
import Classes from './index.module.css'

// ===================================== INTERFACES ========================================

export interface LoginProps {
    name: string;
    className?: string;
    onClick?: (event: MouseEvent) => void;
}

// ===================================== COMPONENT =========================================

function Button({ name, className, onClick }: LoginProps) {
    return (
        <button
            onClick={onClick}
            className={[Classes.btn, className].join(' ')}>
            {name}
        </button>
    )
}

export default Button
