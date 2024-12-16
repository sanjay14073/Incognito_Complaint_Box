import { Router } from "express";
import { ComplaintController } from "../controllers/index.js";
const complaintRouter=Router()

complaintRouter.post('/addComplaint',ComplaintController.addComplaint);
complaintRouter.get('/myComplaint',ComplaintController.getMyComplaints);

export default complaintRouter;