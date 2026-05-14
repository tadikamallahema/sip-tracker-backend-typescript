import jwt from 'jsonwebtoken';
const { invalidToken } = require('../models/investorModel');
const secret = 'mysecret';
export function signJWT(payload) {
    try {
        const token = jwt.sign(payload, secret, {
            expiresIn: '35m'
        });
        return token;
    }
    catch (exception) {
        console.log(exception);
        return undefined;
    }
}
export function verifyJWT(token) {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    }
    catch (exception) {
        console.error(exception);
        return { status: 401, message: 'Invalid token', "error": exception };
    }
}
;
export const investorAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.json("Token required");
        }
        if (invalidToken.find((t) => t === token)) {
            return res.json("Token expired");
        }
        const payload = verifyJWT(token);
        if (payload.role !== 'investor') {
            return res.json("Authorization failed");
        }
        next();
    }
    catch (e) {
        return res.json({
            message: "Authorization failed",
        });
    }
};
