import { Request,Response } from "express";
import { Complaint, User } from "../models/index.js";
import { v4 } from "uuid";
import bcryptjs from 'bcryptjs';


class ComplaintController{
    async addComplaint(req:Request,res:Response){
        const {uuid,complaint,complaint_proof,issue_category,title}=req.body;
        try{
        let mycomplaint=new Complaint()
        let user=await User.findOne({uuid})
        if(user===null){
            res.status(404).json({"message":"User Not Found"})
            return
        }
        let non_hashed_complaint_id=uuid+v4()
        const saltrounds=10;
        //first generate salt
        let salt=await bcryptjs.genSalt(saltrounds);
        let complaint_id=await bcryptjs.hash(non_hashed_complaint_id,salt);
        user.previous_complaints.push(non_hashed_complaint_id);
        await user.save();
        let complaint_to_be_added=complaint;
        if(complaint.length>100){
           complaint_to_be_added="";
        }
        mycomplaint.complaint=complaint_to_be_added;
        mycomplaint.complaint_proof=complaint_proof;
        mycomplaint.issue_category=issue_category;
        mycomplaint.complaint_id=complaint_id;
        mycomplaint.title=title;
    
        await mycomplaint.save();
        
        }catch(e:any){
            console.log(e.message);
            res.status(400).json({"message":e.message})
        }
    }
}

export default new ComplaintController()