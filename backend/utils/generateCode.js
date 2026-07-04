import crypto from 'crypto';

export const generateCode = (length = 6, type = 'numeric') => {
    const chars =
        type === 'numeric'
            ? '123456789'
            : 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    let code = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        code += chars[bytes[i] % chars.length];
    }

    return code;
};
