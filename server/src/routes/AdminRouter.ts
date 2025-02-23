import { Router } from "express";
import { AdminController } from "../controllers/index.js";

const adminRouter=Router()

adminRouter.get('/',AdminController.getAllComplaints)
adminRouter.put('/status',AdminController.updateCurStatusAndComments)
adminRouter.post('/getStatus',AdminController.complaintsByStatus)
adminRouter.post('/category',AdminController.complaintsByCategory)



export default adminRouter;