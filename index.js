// import express inside index.js
const express = require('express')



// Import cors in index.js
const cors = require('cors')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


//import dataservice
const dataservice = require('./services/dataService')

//create server app using express
const server =express()

//use cors to define origin
server.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
server.use(express.json())

//set up port for server app
server.listen(3000,()=>{
    console.log('server started at 3000');
})
//application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log("inside application specific middleware");
    next()
}

// bankapp front end request resolving 


//token verify middleware 
const jwtMiddleware =(req,res,next)=>{
    console.log("inside router specific middleware");
    //get token from req headers
    const token = req.headers['access-token']
    console.log(token);
   
    try{ 
        //verify token
    const data = jwt.verify(token,'supersecretkey123')
    console.log(data);
    req.fromAcno = data.currentAcno;
    next()
    }
    catch{
        console.log("invalid token");
        res.status(401).json({
            message:"please Login!!"
        })

    }
    
     

 
}



//register api call resolving
server.post('/register',(req,res)=>{
    console.log("insiede teh register Api");
    console.log(req.body);
    //asyncrhous 
    dataservice.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   

})


//login api call resolving
server.post('/login',(req,res)=>{
    console.log("insiede login Api");
    console.log(req.body);
    //asyncrhous 
    dataservice.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   

})


//getBalance api

server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log("insiede getBalanceApi");
    console.log(req.params.acno);
    //asyncrhous 
    dataservice.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   

})

//deposit api 

server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log("insiede deposit");
    console.log(req.body);
    //asyncrhous 
    dataservice.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   

})


//fundTransfer api 

server.post('/fundtransfer',jwtMiddleware,(req,res)=>{
    console.log("insiede fundTransfer api");
    console.log(req.body);
    //asyncrhous 
    dataservice.fundtransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
       
        res.status(result.statusCode).json(result)
    })
   

})
// 
server.get('/all-transactions',jwtMiddleware,(req,res)=>{

    console.log("inisde getAll transactions api ")
    dataservice.getAllTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

})
// delete-account api 

server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log("insiede delete api");
    console.log(req.params.acno);
    //asyncrhous 
    dataservice.deleteMyAccount(req.params.acno)
    .then((result)=>{
       
        res.status(result.statusCode).json(result)
    })
   

})