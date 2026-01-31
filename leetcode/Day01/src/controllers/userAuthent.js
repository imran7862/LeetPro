const User = require('../models/user');
const bcrypt = require('bcrypt');
const validate = require('../utils/validator');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const submission = require('../models/submission')


const register = async (req, res) => {
    try {
        validate(req.body);

        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id , emailId:emailId, role:'user' }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        });

         const reply ={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        res.status(201).json({
            user:reply,
            message: 'registered successfully',
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId});
        if (!user) {
            throw new Error('User not found');
        }               
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({_id:user._id , emailId:emailId, role:user.role }, process.env.JWT_SECRET, {expiresIn: 60 * 60});
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        const reply ={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
        }

        res.status(201).json({
            user:reply,
            message: 'logged in successfully',
        });     
    }
    catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        //token add to blacklist in redis
        const token = req.cookies.token;


        await redisClient.set('token:' + token, 'blacklisted');
        // res.clearCookie('token');
        await redisClient.expire('token:' + token, 60 * 60); // 1 hour expiration
        res.cookie('token',null,{expires: new  Date(Date.now())});
        res.send({
            message: 'User logged out successfully',
        });


    }
    catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const adminRegister = async (req, res) => {
    try {
        validate(req.body);

        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        // req.body.role = 'admin'; // Set role to admin
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id , emailId:emailId, role:user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(201).send({
            message: 'User registered successfully',
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('User not authenticated');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({emailId: decoded.emailId});
        if (!user) {
            throw new Error('User not found');
        }
        res.status(200).send({
            user: {
                firstName: user.firstName,
                emailId: user.emailId,
            },
        });
    }
    catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const deleteProfile = async (req , res) =>
{
    try {
        const userId = req.result._id;

        //userSchema se delete
        await User.findByIdAndDelete(userId);
        // submission se bhi delete
        // await submission.deleteMany({userId})

        res.status(200).send("deleted successfuly")

    }
    catch(err){
        res.status(500).send("error"+err.message);

    }
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
    adminRegister,
    deleteProfile
};