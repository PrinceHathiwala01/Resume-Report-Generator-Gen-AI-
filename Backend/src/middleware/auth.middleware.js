const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../model/blacklist.model");

async function authUser(req, res, next) {

    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is blacklisted"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }catch(err){
            return res.status(401).json({
             message: "Invalid Token"
        })
    }    
}

async function optionalAuthUser(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return next();
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
        res.clearCookie("token");
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
    } catch {
        res.clearCookie("token");
    }

    next();
}

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return req.cookies.token;
}

module.exports = {authUser, optionalAuthUser};
