import express from 'express';
import cors from 'cors';
import {connect} from 'mongoose';
import { config } from 'dotenv';
import mainRouter from './routes/index.js';

config();

const app=express()

app.use(cors())
app.use(mainRouter);

const PORT=process.env.PORT||3000

async function mongoConnect(){
    try{
    const mongoURI=process.env.MONGO_URI||"";
    await connect(mongoURI);
    console.log("Connection to mongo sucessful")
    }catch(e:any){
        console.log(e.message);
    }
}

app.listen(PORT,async()=>{
    await mongoConnect();
    console.log(`PORT started on port ${PORT}`)
})

