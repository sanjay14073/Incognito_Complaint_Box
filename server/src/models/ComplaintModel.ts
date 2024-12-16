import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  complaint: {
    type: String,
    required: true,
  },
  summarized_complaint:{
    type:String,
    required:true,
    default:""
  },
  complaint_proof: {
    type: String,
  },
  issue_category: {
    type: [String],
    required: true,
    default:[]
  },
  complaint_id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    default: "Complaint Registered",
  },
  statusProof:{
    type:String,
    required:true,
    default:"www.google.com"
  },
  curStatus: {
    type: String,
    required: true,
    default: "Complaint taken",
  },
  lastupdate: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  priority_factor:{
    type:Number,
    default:0.0,
    required:true
  }
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;