import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

export function ButtonBasic ({ variant, content, ...props}) {
    // variant = text, contained, outlined
    return <Button variant={variant}>{content}</Button>
}

export function ButtonIcon ({ content, ...props}) {
    return <Button>{content}</Button>
}

export function ButtonLink ({ content, href, ...props}) {
    return <Button href={href}>{content}</Button>
}