//import db.js
const db = require('./db')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


//register 
const register =(uname,acno,pswd)=>{
    console.log("inside register funciton in data services")
    //asynchronous function 
    //check acno is in mongodb - db.users.findOne()
    return db.User.findOne({
        acno

    }).then((result)=>{
        console.log(result);
        if(result){
            //acno already exist 
            return{
                statusCode:403,
                message:'Account Already exists!!'

            }
        }
        else{
            // to add new user
            const newUser =  new db.User({
                username:uname,
                acno,
                password:pswd,
                balance:0,
                transaction:[]
            })
            //to save new user in mangodb use save()
            newUser.save()
            return{
                statusCode:200,
                message:'Registration successfull.....'
            }

        }
    })


}

//login

const login = (acno,pswd)=>{
    console.log("inside login function body");
    //check acno , pswd in mongodb 
    return db.User.findOne({
        acno,
        password:pswd
    }).then(
        (result)=>{
            if(result){
                //generate token 
                const token = jwt.sign({
                    currentAcno:acno

                },'supersecretkey123')
                return {
                    statusCode:200,
                    message:'login successfull.....',
                    username:result.username,
                    currentAcno:acno,
                    token
                }
            }
            else{
                return{
                    statusCode:404,
                    message:'Invalid account/ password'
    
                }
            }
            

        }

    )


}
//get Balance
const getBalance = (acno)=>{
  return   db.User.findOne({
    acno
  }).then(
    (result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid account'
            }
        }



    }
  )


}

//deposit
const deposit =(acno,amt)=>{
    let amount = Number(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            //acno is present in db 
            result.balance +=amount
            result.transaction.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            result.save()
            return{
                statusCode:200,
                message:`${amount} successfully deposited...`

            }
        
        

        }
        else{
            return{
                statusCode:404,
                message:'invalide account '
            }
        }

    })
}

//fundtrasfer

const fundtransfer = (req,toAcno,pswd,amt) =>{

    let amount =Number(amt)
    let fromAcno = req.fromAcno
    return db.User.findOne({
        acno:fromAcno,
        password:pswd
        
    }).then(result=>{
       // console.log(result);
       if(fromAcno==toAcno){
        return{
            statusCode:401,
            message:"Permission denied due to own account transfer"
        }
       }
        if(result){

            // debit account details 
            let fromAcnoBalance = result.balance;
            if(fromAcnoBalance >= amount){
                
                result.balance = fromAcnoBalance - amount;
                
                //credit account details 

                return db.User.findOne({
                    acno:toAcno
                }).then(creditdata=>{
                    if(creditdata){
                        creditdata.balance += amount
                        creditdata.transaction.push({
                            type:"CREDIT",
                            fromAcno,
                            toAcno,
                            amount

                        })
                        creditdata.save();
                        console.log(creditdata);

                        result.transaction.push({
                            type:"DEBIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        
                        result.save();
                        console.log(result)
                        return{
                            statusCode:200,
                            message:'Amount Transfer successfully '
                        }

                    }
                    else{

                        return{
                            statusCode:401,
                            message:'Invalid credit account number '
                        }

                    }
                })
                


            }
            else{

                return{
                    statusCode:403,
                    message:'Insuffiecient Balance '
                }

            }


        }
        else{
            return {
                statusCode:404,
                message:'invalide debit account number / password '
            }
        }
    })


}

//getAllTransactions
const getAllTransactions =(req) =>{
let acno = req.fromAcno
return db.User.findOne({
    acno
}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transaction:result.transaction
        }

    }
    else{

        return{
            statusCode:401,
            message:'invalide account Number '
        }

    }
})

     
}

//deleteMyAccount

const deleteMyAccount = (acno)=>{ 
    return db.User.deleteOne({
        acno
    })
    .then(
        (result)=>{
            if(result){

                return{

                    statusCode:200,
                    message:'Account deleted successfully '
                }
            }
            else{
                return{
                    statusCode:401,
                    message:'Invalid  account number '
                }
            }
        }
    )


}




//export
module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundtransfer,
    getAllTransactions,
    deleteMyAccount
    
}