const User=require('../models/userModel');
const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');

//get user profile
exports.getUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);   
    if(user){
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

//update user profile
exports.updateUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);
    const {username,email}=req.body;
    if(username) user.username=username;
    if(email) user.email=email;
    if(user){
        const updatedUser=await user.save();
        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

