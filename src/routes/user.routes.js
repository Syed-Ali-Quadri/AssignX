import { Router } from "express";
import { createUser, updateUserInfo } from "../controllers/user.controller.js";
import { handleFileCleanup, upload } from "../middlewares/multer.middleware.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const route = Router();

route
	.route("/signup")
	.post([upload.single("avatar")], createUser, handleFileCleanup);
route
	.route("/:userId/user-update")
	.put(userAuth, updateUserInfo)

export default route;
