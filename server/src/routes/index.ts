import { Router } from "express";
import authRouter from "./AuthRouter.js";
import complaintRouter from "./ComplaintRouter.js";
import adminRouter from "./AdminRouter.js";
import healthRouter from "./HealthRouter.js";

const mainRouter=Router()

mainRouter.use('/health',healthRouter)
mainRouter.use('/auth',authRouter)
mainRouter.use('/complaints',complaintRouter)
mainRouter.use('/admin',adminRouter)


export default mainRouter;