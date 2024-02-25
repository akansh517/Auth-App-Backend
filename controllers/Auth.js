// the password which we have in the string format that we will convert into an encrypted format or secure format and we are calling that process as hashing . We will achieve this task by using an library that is called bcrypt which is basically used for hash passwords


const bcrypt=require('bcrypt');
// import the model 
const User=require('../models/User');
const jwt=require('jsonwebtoken');
require('dotenv').config();

// signup route handler 

exports.signup =async(req,res) => {
    try{
        // get data 
        const{name,email,password,role}=req.body;
        //check if user already exists
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        //Secure password
        //  we can secure the passord by using bcrypt.hash() fxn which takes 2 parameters 
        //  1.the value which has to be hashed and 
        //  2.the number of rounds that after how many rounds it will give the result i.e optimal rounds=10 

        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }

        // there can be errors while hashing the password like after this much number of strategies it will throw me that password can't be hashed like retry strategies 
        catch(err){
            res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }

        // Create entry for user 
        // all these things are inserted into the db by using the below syntax
        const user=await User.create({
            name,email,password:hashedPassword, role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully"
        })
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User can't be registered,please try again later"
        })
    }
}


// login 
exports.login=async(req,res)=>{
    try{
        // data fetch 
        const {email,password}=req.body;
        // validation in email and password 
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }
        
        // check for registered user 
        let user=await User.findOne({email});
        // if not a registered user 
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        // verify password and generate a JWT token 
        // if i am doing password validation then i will also doing hashing inside it also so i have to use await and the compare fxn of bcrypt library is used for password verification bcrypt.compare() takes 2 parameters first is the normal password and second is the encrypted password 

        // encrypted data is in user 

        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        // verify password and generate a JWT token 
        if(await bcrypt.compare(password,user.password)){
            // after password match we will first create the token
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                })
                user=user.toObject();//convert the user to object for passing token into the user 
                user.token=token;   //inside the user i have created a new entry named token but if i will give the object inside which password is also present so to remove the password i will undefine the password as given below 
                user.password=undefined;//i am removing the password from the user object and not from the database


                // creating cookie 
                // i am adding the cookie to the response 
                // inside the cookie we have to pass 3 parameters inside it 
                // 1.cookie name 
                // 2.cookie data
                // 3.options like ValidityState,expiry,client side par cookie ko access nhi kiya ja skta 

                const options={
                    expires:new Date (Date.now() + 24*3*60*60*1000), //the cookie will expire in 3 days adter starting 
                    httpOnly:true //by using this we are not able to access it on the client side 
                }

                res.cookie("token",token,options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"User logged in Successfully"
                });


                // without cookie authentication can be done only by parsing the token into body or header only
                // res.status(200).json({
                //     success:true,
                //     token,
                //     user,
                //     message:"User logged in Successfully"
                // });

        }
        else{
            // password do not match 
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure"
        })
    }
}

// so to do overcome the problem of doing login again and again we have used  the middlewares that will authenticate and authorize the user  