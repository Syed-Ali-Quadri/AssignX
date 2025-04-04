import { AsyncHandler } from "../utilities/Asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { uploadFileOnCloudinary, deleteFileOnCloudinary } from "../utilities/Cloudinary.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import fs from "fs"

const createUser = AsyncHandler(async (req, res) => {
	const { fullName, username, email, password, phoneNo } = req.body;
    const avatarLocalFile = req.file?.path;

	if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim())
		throw new ApiError(406, "Fill up the required field.");

	if (validator.isEmail(email) === false)
		throw new ApiError(401, "Email is not valid.");

	if (phoneNo && validator.isMobilePhone(phoneNo, "+91") === false)
		throw new ApiError(401, "Phone number is not vaild.");

	const findUser = await User.find({
		$or: [{ email }, { username }]
	});

	if (findUser) throw new ApiError(401, "User already exist.");

    try {

        const avatar = await uploadFileOnCloudinary(avatarLocalFile, "image");
        if(!avatar) throw new ApiError(404, "Image not found.");
        
        const user = await User.create({
            fullName,
            email,
            username,
            password,
            phoneNo,
            avatar: avatar.url
        });
    
        if (!user) throw new ApiError(500, "Error while creating the user.");
        fs.unlinkSync(avatarLocalFile);

        return res
            .status(201)
            .json(new ApiResponse(201, user, "User created successfully."));
    } catch (error) {
        fs.unlinkSync(avatarLocalFile);
        new ApiError(500, "Something went wrong.");
    }
    
});

const updateUserInfo = AsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { fullName, username, email, phoneNo } = req.body;

    if (!fullName && !username && !email && !phoneNo)
        throw new ApiError(406, "Fill up at least one field.");

    if (email && !validator.isEmail(email))
        throw new ApiError(401, "Email is not valid.");

    if (phoneNo && !validator.isMobilePhone(phoneNo, "en-IN"))
        throw new ApiError(401, "Phone number is not valid.");

    if (!mongoose.Types.ObjectId.isValid(userId))
        throw new ApiError(400, "Invalid user ID.");

    const findUser = await User.findById(userId);
    if (!findUser)
        throw new ApiError(404, "User not found.");

    let isSaved = false;

    const user = await User.findById(userId);

    if (fullName?.trim()) {
        user.fullName = fullName;
        isSaved = true;
    }
    if (username?.trim()) {
        user.username = username;
        isSaved = true;
    }
    if (email?.trim()) {
        user.email = email;
        isSaved = true;
    }
    if (phoneNo?.trim()) {
        user.phoneNo = phoneNo;
        isSaved = true;
    }

    if (isSaved) await user.save({ validBeforeSave: true });

    const updatedUser = await User.findById(findUser._id);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User info updated successfully."));
});

const updateUserAvatar = AsyncHandler(async (req, res) => {
	const { userId } = req.params;
    const avatarLocalFile = req.file?.path;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

    if (!avatarLocalFile)
        throw new ApiError(406, "Avatar file is not uploaded.");

    try {

        const avatar = await uploadFileOnCloudinary(avatarLocalFile, "image");
        if(!avatar) throw new ApiError(404, "Image not found.");
            
        const user = await User.findByIdAndUpdate(userId, { avatar: avatar.url });
        
        if (!user) throw new ApiError(500, "Error while updating the user.");
        fs.unlinkSync(avatarLocalFile);
    
        return res
            .status(200)
            .json(new ApiResponse(200, user , "User avatar updated successfully."));

        } catch (error) {
            fs.unlinkSync(avatarLocalFile);
            new ApiError(500, "Something went wrong.");
        }
});

const updateUserPassword = AsyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { oldPassword, newPassword } = req.body;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User password updated successfully."));
});

const getUserInfo = AsyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User created successfully."));
});

const deleteUser = AsyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User created successfully."));
});

const logoutUser = AsyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User Logout successfully."));
});

const getRefreshToken = AsyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				"",
				"Refresh token and access token generated successfully."
			)
		);
});

// Only admin access routes:
const deleteUserAdminOnly = AsyncHandler(async (req, res) => {
	const { userId } = req.body;

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User created successfully."));
});

const getAllUsersAdminOnly = AsyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, "", "User created successfully."));
});

export {
	createUser,
	updateUserInfo,
	updateUserAvatar,
	updateUserPassword,
	getUserInfo,
	deleteUser,
	getRefreshToken,
	getAllUsersAdminOnly,
	deleteUserAdminOnly
};
