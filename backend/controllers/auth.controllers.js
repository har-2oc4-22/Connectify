import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

/**
 * Register a new user
 * @route POST /api/auth/signup
 * @access Public
 */
export const signUp = async (req, res, next) => {
    try {
        let { userName, email, password } = req.body
        
        // Basic input validation
        if (!userName || !email || !password) {
            const error = new Error("Please provide userName, email, and password");
            error.statusCode = 400;
            return next(error);
        }

        userName = userName.trim();
        email = email.trim().toLowerCase();

        const checkUserByUserName = await User.findOne({ userName })
        if (checkUserByUserName) {
            const error = new Error("userName already exists");
            error.statusCode = 400;
            return next(error);
        }

        const checkUserByEmail = await User.findOne({ email })
        if (checkUserByEmail) {
            const error = new Error("email already exists");
            error.statusCode = 400;
            return next(error);
        }

        if (password.length < 6) {
            const error = new Error("password must be at least 6 characters");
            error.statusCode = 400;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            userName, email, password: hashedPassword
        })

        const token = await genToken(user._id)

        const isProduction = process.env.NODE_ENV === "production" || process.env.CLIENT_URL?.startsWith('https') || process.env.RENDER;
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: isProduction ? "None" : "Strict",
            secure: !!isProduction
        })

        // Ensure password is not sent back to client
        const safeUser = user.toObject();
        delete safeUser.password;
        safeUser.token = token;

        return res.status(201).json(safeUser)

    } catch (error) {
        next(error)
    }
}

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            const error = new Error("Please provide email and password");
            error.statusCode = 400;
            return next(error);
        }

        email = email.trim().toLowerCase();

        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            return next(error);
        }

        const token = await genToken(user._id)

        const isProduction = process.env.NODE_ENV === "production" || process.env.CLIENT_URL?.startsWith('https') || process.env.RENDER;
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: isProduction ? "None" : "Strict",
            secure: !!isProduction
        })

        // Ensure password is not sent back to client
        const safeUser = user.toObject();
        delete safeUser.password;
        safeUser.token = token;

        return res.status(200).json(safeUser)

    } catch (error) {
        next(error)
    }
}

/**
 * Logout user
 * @route GET /api/auth/logout
 * @access Public
 */
export const logOut = async (req, res, next) => {
    try {
        const isProduction = process.env.NODE_ENV === "production" || process.env.CLIENT_URL?.startsWith('https') || process.env.RENDER;
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: isProduction ? "None" : "Strict",
            secure: !!isProduction
        });
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        next(error)
    }
}