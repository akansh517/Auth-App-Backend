// auth, isStudent , isAdmin - 3 middlewares 
// for the Authorization i have created these 2 middlewares   isStudent and isAdmin


const jwt=require("jsonwebtoken");
require('dotenv').config();

// next is basically used to call the other middlewares after the execution of one middleware 
exports.auth=(req,res,next)=>{
    try{
        // extract jwt token 
        // we can fetch the token by the 3 methods             
        // 1.from the req Request body 
        // 2.from the cookies 
        // 3.from the header 
        console.log("cookie" ,req.cookies.token)
        console.log("body" ,req.body.token)
        console.log("cookie" ,req.header("Authorization"));

        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","") ;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }

        //verify the token

        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET); //gives the decoded object or token
            // the above decode fxn takes 2 parameters 
            // 1.token
            // 2.SECRET_KEY
            console.log(payload);
            req.user=payload; //i am storing into the req so that i will check the role that the user is student or admin that i will do by using payload 
            console.log(payload);
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }

        next(); //go to next middleware
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token"
        })
    }
}

// The below middlewares are basically used for the purpose of authorization only 

// 2nd middleware isStudent 

// how can i know that the user is student or not - by his role 

exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role!="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students"
            })
        }
        next();//for calling next middleware
    }   
    // not passing the success true status bcz i have passed that inside the routes 

    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}




// isAdmin middleware 

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admins only"
            })
        }
        next();
    }   

    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }   
}