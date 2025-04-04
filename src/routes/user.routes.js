import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import { handleFileCleanup, upload } from "../middlewares/multer.middleware.js";

const route = Router();

route
	.route("/signup")
	.post([upload.single("avatar")], createUser, handleFileCleanup);

export default route;
