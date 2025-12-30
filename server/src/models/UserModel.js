import mongoose from "mongoose";
//Model only defines structure

//schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    }
},
{
    timestamps:true
})

//model
const UserModel = mongoose.model('User',userSchema);


//export
export default UserModel;

/*{
  "id": "69533622ea88810ffc733f0f",
  "username": "Yogesh",
  "email": "yogesh@gmail.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTMzNjIyZWE4ODgxMGZmYzczM2YwZiIsImlhdCI6MTc2NzA2MTAyNiwiZXhwIjoxNzY3NjY1ODI2fQ.e6tA7zdma98nBLhB7TR7hVr0qvawD4h-oUkbK_txleY"
}*/