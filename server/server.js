//yogeshsabbani67_db_user
//W0RmaYgXfPbYsSfQ

//mongodb+srv://yogeshsabbani67_db_user:<db_password>@cluster0.1ki034b.mongodb.net/
import app from "./src/app.js";
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouter from "./src/routes/authRoutes.js";
dotenv.config();

connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is runnign on port ${PORT}`);
    
})