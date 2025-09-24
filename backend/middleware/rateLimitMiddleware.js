import rateLimit from 'express-rate-limit'


// Limit requests to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 5 requests per window
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disable `X-RateLimit-*` headers
});

export default limiter;
