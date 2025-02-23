import { Request,Response } from "express";
import { Complaint, User } from "../models/index.js";
import { v4 } from "uuid";
import bcryptjs from 'bcryptjs';
import client from "../utils/RedisSetup.js";
import model from "../utils/GeminiSetup.js";
import axios from "axios";


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
        
        //We need to make external call to our in house ML model to give a priority rating

        //generate summary
        try {
            let response = await axios.post('http://127.0.0.1:5000/getSummary', {
                message: complaint_to_be_added
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            let data = response.data;
         //   complaint = data.summary;
            mycomplaint.summarized_complaint=data.summary;

            //Get score and normalize
            response = await axios.post('http://127.0.0.1:5000/getScore', {
                complaint: complaint_to_be_added
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            data= response.data;
            let score=data.index;
            response = await axios.post('http://127.0.0.1:5000/normalize', {
                score: score,
                categories: issue_category
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            data=response.data;
            mycomplaint.priority_factor=data.complaint_severity_score;


        } catch (e) {
            console.log("Error:", e);
        }

        //Save it
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