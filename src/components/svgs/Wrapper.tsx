import React from 'react'

export interface ISVGWrapperProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    src: React.ReactNode
}

export default function SVGWrapper({ src, ...props }: ISVGWrapperProps) {
    return <div {...props}>{src}</div>
}
