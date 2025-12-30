import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
        .then((resp)=>{console.log('MongoDB connected Succesfully')})
        .catch((err)=>{console.log('Error in MongoDB connection!!')})
}
export default connectDB;