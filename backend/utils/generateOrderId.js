import crypto from 'crypto'

export const generateOrderId = () => {
    // DATE
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    
    // 5-character random alphanumeric
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase()

    return `ORD-${datePart}-${randomPart}`
}