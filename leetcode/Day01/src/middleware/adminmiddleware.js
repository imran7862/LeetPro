const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Token is not present');
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Payload:', payload);

        const { _id } = payload;
        if (!_id) {
            throw new Error(' ID is not present in the token');
        }
 
        const result = await User.findById(_id);
        if(payload.role !== 'admin') {
            throw new Error('User is not an admin');
        }

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

module.exports = adminMiddleware;