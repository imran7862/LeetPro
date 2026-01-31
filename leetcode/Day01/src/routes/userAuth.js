const express= require('express');
const authRouter = express.Router();
const {register, login, logout, getProfile, adminRegister, deleteProfile} = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/usermiddelware');
const adminMiddleware = require('../middleware/adminmiddleware');

//Register User
authRouter.post('/register', register);
//Login User
authRouter.post('/login',login);
//Logout User
authRouter.post('/logout',userMiddleware, logout); 
//Get User Profile
authRouter.get('/getprofile',getProfile);
//admin register
authRouter.post('/admin/register', adminMiddleware, adminRegister);

//delete profile
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile)

//
authRouter.get('/check', userMiddleware, (req, res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        // role:user.role,
    }

    res.status(200).json({
        user:reply,
        message:"valid user"
    });
})

//Export the authRouter
module.exports = authRouter;
