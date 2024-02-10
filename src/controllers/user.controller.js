import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadonCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";}
const registerUser = asyncHandler( async (req,res)=>{
    //get user detail from frontend
    //validation - not empty
    //check if user already exitdst: username, email
    //check for image and avatar
    //upload them to cloudinary
    //create user object - create entry in db
    //remove password and refreshToken from user object
    //check for user creation
    //return res
    const {fullname,email,password,username}= req.body;

        if(
            [fullname,email,password,username].some((field)=> field?.trim()==="")
        ){
            throw new ApiError(400,"All fields are required")
        }

        User.findOne({$or:[{email},{username}]},(err,user)=>{
            if(err){
                throw new ApiError(500,"Something went wrong")
            }
            if(user){
                throw new ApiError(400,"User already exists")
            }
        });
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.image?.[0]?.path;

        if(!avatarLocalPath || !coverImageLocalPath){
            throw new ApiError(400,"Avatar and cover image are required")
        }
        //upload to cloudinary
        const avatar = await uploadonCloudinary(avatarLocalPath);
        const coverImage = await uploadonCloudinary(coverImageLocalPath);
        if(!avatar || !coverImage){
            throw new ApiError(500,"Something went wrong")
        }

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage.url,
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if(!createdUser){
            throw new ApiError(500,"Something went wrong")
        }
            
        res.status(201).json(new ApiResponse(200,createdUser,"User created"))
    })

export {registerUser}