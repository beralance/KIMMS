import crypto from 'crypto'

export const generateOrderId = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase()

    return `ORD-${datePart}-${randomPart}`
}