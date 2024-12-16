import { Request,Response } from "express";
import { Complaint, User } from "../models/index.js";
import { v4 } from "uuid";
import bcryptjs from 'bcryptjs';
import client from "../utils/RedisSetup.js";
import model from "../utils/GeminiSetup.js";


class ComplaintController{
    async addComplaint(req:Request,res:Response){
        const {uuid,complaint,complaint_proof,issue_category,title}=req.body;
        try{
        let mycomplaint=new Complaint()
        let user=await User.findOne({uuid})
        if(user===null){
            res.status(404).json({"message":"User Not Found"})
            return;
        }
        let non_hashed_complaint_id=uuid+v4()
        const saltrounds=10;
        //first generate salt
        let salt=await bcryptjs.genSalt(saltrounds);
        let complaint_id=await bcryptjs.hash(non_hashed_complaint_id,salt);
        user.previous_complaints.push(non_hashed_complaint_id);
        await user.save();
        let complaint_to_be_added=complaint;
        
        //generate complaint summary
        const prompt=`Summarize this complaint within 200 words make sure that its meaning doesnot change ${complaint_to_be_added}`;
        let content=(await model.generateContent([prompt]));
        //Save it
        mycomplaint.summarized_complaint=content.response.text();
        mycomplaint.complaint=complaint_to_be_added;
        mycomplaint.complaint_proof=complaint_proof;
        mycomplaint.issue_category=issue_category;
        mycomplaint.complaint_id=complaint_id;
        mycomplaint.title=title;
    
        await mycomplaint.save();
        await client.set(non_hashed_complaint_id,complaint_id);
        res.status(201).json({"message":"Added Complaint Sucessfully"})
        }catch(e:any){
            console.log(e.message);
            res.status(400).json({"message":e.message})
        }
    }
    async getMyComplaints(req:Request,res:Response){
        const {uuid}=req.body;
        let user=await User.findOne({uuid})
        if(user===null){
            res.status(404).json({"message":"User Not Found"})
            return;
        }
        let complaints=user.previous_complaints;
        let newlist=[]
        for(let i=0;i<complaints.length;i++){
            try{
                console.log(complaints[i])
                let x=await client.get(complaints[i]);
                console.log(x);
                if(x!==null){
                    let complaint=await Complaint.findOne({complaint_id:x});
                    if(complaint!==null){
                        newlist.push(complaint)
                    }
                }
            }catch(e:any){
                console.log(e.message)
                res.status(404).json({"message":"was not able to find"})
            }
        }
        //console.log({"the complaint list of a user":newlist})
        res.status(201).json({"the complaint list of a user":newlist})
    }
}

export default new ComplaintController()