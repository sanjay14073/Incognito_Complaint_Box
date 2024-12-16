import { Router } from "express";
import { AuthController } from "../controllers/index.js";

const authRouter=Router()

authRouter.post('/signup',AuthController.signup);
authRouter.post('/signin',AuthController.signin);
authRouter.post('/signout',AuthController.signout);

export default authRouter;