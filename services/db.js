//import mongoose in db.js file 
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


// using mongoose define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log("mongobd connected succesfully");
})

//create model for the project
//collectoin - users 

const User = mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

//export model
module.exports={
    User
}

