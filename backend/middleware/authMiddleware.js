import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verify Error:", err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        req.user = null;
        console.log("No auth header → guest");
        return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) {
        req.user = null;
        console.log("No token → guest");
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        console.warn("JWT Verify Error (optional):", err.message);
        req.user = null;
    }
    console.log('')
    next();
};

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({error: 'Admin access only'})
    }
    next();
}

export const requireRole = (roles) => {

    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log('WE ARE IN!')
            console.log('USER check', req.user)
            return res.status(403).json({error: 'Access denied'})
        }
        
        next()
    }
}
