import { AsyncHandler } from "../utilities/Asynchandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const createUser = AsyncHandler(async (req, res) => {
	const { fullName, username, email, password, phoneNo } = req.body;

	if (fullName || username || email || password)
		throw new ApiError(406, "Fill up the required field.");

	if (validator.isEmail(email) === false)
		throw new ApiError(401, "Email is not valid.");

	if (phoneNo && validator.isMobilePhone(phoneNo, "+91") === false)
		throw new ApiError(401, "Phone number is not vaild.");

	const findUser = await User.find({
		$or: [{ email }, { username }]
	});

	if (findUser) throw new ApiError(401, "User already exist.");

	// TODO: First using multer accept the picture file and upload to the cloud store and save it on database and delete the file anyway.
	const user = await User.create({
		fullName,
		email,
		username,
		password,
		phoneNo
		// avatar
	});

	if (!user) throw new ApiError(500, "Error while creating the user.");

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User created successfully."));
});

const updateUserInfo = AsyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { fullName, username, email, phoneNo } = req.body;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User info updated successfully."));
});

const updateUserAvatar = AsyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (
		!mongoose.Types.ObjectId.isValid(userId) ||
		!await User.findById(userId)
	)
		return new ApiError(500, "Invalid request.");

	return res
		.status(200)
		.json(new ApiResponse(200, "", "User avatar updated successfully."));
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
