const userModel = require("../model/user.model");
const tokenBlacklistModel = require("../model/blacklist.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER)
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
}

//This controller is used to register new user in the database.
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        //This is to check if all the fields are filled or not
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //This is to check if the user is already exists or not
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User already exists with same credentials"
            })
        }

        //This is used to hash the password provided bu the user and the it will save it in the database
        const hash = await bcrypt.hash(password, 10);
        
        //This part is used to create a new user in the database
        const user =await userModel.create({
            username,
            email,
            password: hash
        });

        //This part is used to create a token for the user
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        //This part is used to set the token in the cookie
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
        })
    } catch (err) {
        console.log("Error in registering user", err);
        res.status(500).json({
            message: "Unable to register user"
        })
    }
}

//This controller is used to login the user and provide them with a token for authentication.
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;
        
        //This is to check if all the fields are filled or not
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }
        
        //This is to check whether user exists or not
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message:"Invalid Credentials, User not found"
            })
        }

        //This is to check whether the password is correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { 
            return res.status(400).json({
                message: "Invalid Credentials, Wrong Password"
            })
        }

        //This is to create a token for the user
        const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
    });
    } catch (err) {
        console.log("Error in logging in user", err);
        res.status(500).json({
            message: "Unable to login user"
        })
    }
}

//This controller is used to logout the user by clearing the token from the cookie.
async function logoutUserController(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({
            token
        })
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite
    });
    res.status(200).json({
        message: "User logged out successfully"
    })
}

//This controller is used to get the details of the user who is logged in
async function getMeController(req, res) { 
    if (!req.user?.id) {
        return res.status(401).json({
            message: "User is not authenticated",
            user: null
        })
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            user: null
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
