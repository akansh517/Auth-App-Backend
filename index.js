const express=require('express');
const app=express();

require('dotenv').config();
const PORT=process.env.PORT || 4000;

// cookie parser 
const cookieParser=require('cookie-parser')
app.use(cookieParser());

// body parser 
app.use(express.json());

require('./config/database').connect();  //database called 

// route import and mount 

const user=require('./routes/user');
app.use('/api/v1',user);

app.listen(PORT,()=>{
    console.log(`APP is started at ${PORT}`);
})


app.get('/',(req,res)=>{
    res.send(`<h1>Hello boyz</h1>`)
})