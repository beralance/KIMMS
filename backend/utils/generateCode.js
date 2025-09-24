// utils/generateCode.js
import crypto from 'crypto';

/**
 * Generate a random verification code
 * @param {number} length - Length of the code (default 6)
 * @param {string} type - 'numeric' or 'alphanumeric'
 * @returns {string} Generated code
 */
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
