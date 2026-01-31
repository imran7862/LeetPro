const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Token is not present');
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Payload:', payload);

        const { emailId } = payload;
        if (!emailId) {
            throw new Error('emailId is not present in the token');
        }

        const result = await User.findOne({ emailId });
        if (!result) {
            throw new Error('User not found');
        }

        const isBlacklisted = await redisClient.exists('token:' + token);
        if (isBlacklisted) {
            throw new Error('Token is blacklisted, invalid token');
        }

        req.result = result;
        return next(); 
    } catch (error) {
        res.status(401).send({
            message: 'Unauthorized',
            error: error.message,
        });
    }
};

module.exports = userMiddleware;