import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";

const route = Router();

route.route("/signup").post(createUser);

export default route;