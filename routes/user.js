const express=require('express');
const router=express.Router();

const User=require('../models/User');

const {login , signup} =require('../controllers/Auth');

// middlewares
const {auth,isStudent,isAdmin}=require('../middlewares/auth');


// normal routes

router.post('/login',login);
router.post('/signup',signup);


// protected routes means the user with the appropriate role can only access that route and no one else can access the route 
// like different -2 roles are assigned and different-2 permissions are assigned to each role 

// Protected route 

// testing protected route for single middleware 
router.get('/test', auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Test Protected route"
    });
})


// firstly we will pass path after that middlewares that can intercept in between i have to intoduce the middlewares that will be used in between this path and after that i can write the application,handler or call back fxn that we can generally write 
// first auth middleare will execute that will verify that the user is authenticated or not and after that isStudent middleware will run that will check the role for student  

// authentication -id verification
// authorization - rules and permission dependent i.e access rights 

router.get('/student', auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Student Protected route"
    });
})


router.get('/admin',auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Admin protected route"
    })
})


router.get('/getEmail',auth,async(req,res)=>{
    try{
        const id=req.user.id;
        console.log(id)
        const user=await User.findById(id);
        res.status(200).json({
            success:true,
            user:user,
            message:"Welcome to the Email Route"
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            error:error.message,
            message:"Fatal Error"
        })
    }

})



module.exports=router;