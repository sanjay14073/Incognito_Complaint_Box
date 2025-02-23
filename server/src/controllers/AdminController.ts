import { Request,Response } from "express";
import { Complaint } from "../models/index.js";
class AdminController{
    async getAllComplaints(req:Request,res:Response){
        try{
            let complaint_list=await Complaint.find();
            res.status(200).json({"complaint_list":complaint_list})

        }catch(e){
            res.status(400).json({"message":"Something went wrong"})
        }
    }
    async updateCurStatusAndComments(req:Request,res:Response){
        try{
            const {complaint_id,comments,status}=req.body;
            let complaintToBeUpdated=await Complaint.findOne({complaint_id});
            if(complaintToBeUpdated!=null){
            complaintToBeUpdated.status=status;
            complaintToBeUpdated.comments=comments;
            complaintToBeUpdated.lastupdate = new Date(Date.now());
            await complaintToBeUpdated.save();

            }else{
                res.status(404).json({"message":"Complaint Not Found"});
            }
            res.status(203).json({"message":"Updated Sucessfully"})

        }catch(e){
            res.status(400).json({"message":"Something Went Wrong"})
        }
    }
    async complaintsByStatus(req:Request,res:Response){
        try{
            const {status}=req.body;
            let complaintsOfParticularStatus=await Complaint.find({status})
            res.status(200).json({"complaints":complaintsOfParticularStatus})
        }catch(e){
            res.status(404).json({"message":"Something Went Wrong"})
        }
    }
    async complaintsByCategory(req:Request,res:Response){
        try{
            const {category}=req.body;
            let complaints=await Complaint.find({})
            let complaintsOfCategory = complaints.filter((x) => 
                x.issue_category.some((y) => y.toLowerCase() === category.toLowerCase())
            );
            res.status(200).json({"complaints":complaintsOfCategory})
        }catch(e){
            res.status(404).json({"message":"Something Went Wrong"})
        }
    }

    
}

export default new AdminController()