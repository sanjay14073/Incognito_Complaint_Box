import { Router } from "express";
import authRouter from "./AuthRouter.js";
import complaintRouter from "./ComplaintRouter.js";
import adminRouter from "./AdminRouter.js";
import healthRouter from "./HealthRouter.js";
import { verifyToken, verifyAdmin, verifyUser } from "../utils/verifyUser.js"; // Import your middleware

const mainRouter = Router();

// Public routes (no authentication required)
mainRouter.use('/health', healthRouter);
mainRouter.use('/auth', authRouter);

// Authenticated routes
mainRouter.use('/complaints', complaintRouter); // All complaints routes require authentication
mainRouter.use('/admin', adminRouter); // Admin routes require both authentication and admin role

export default mainRouter;