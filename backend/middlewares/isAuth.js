import jwt from "jsonwebtoken"

/**
 * Authentication Middleware
 * Protects routes by verifying JWT cookies.
 */
const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        // Fallback to Bearer token for cross-domain issues
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            const error = new Error("Authentication required. Please log in.");
            error.statusCode = 401; // 401 Unauthorized is more appropriate than 400
            return next(error);
        }

        let verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        // Log locally for debugging, global error handler will catch common JWT errors
        console.error("Auth Middleware Error:", error.message)
        next(error)
    }
}

export default isAuth