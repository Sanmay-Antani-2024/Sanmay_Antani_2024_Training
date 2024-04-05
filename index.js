const path = require('path');                       
const express=require('express');
const app = express(); 
const bodyp=require('body-parser');
const cookieParser=require('cookie-parser')
const PORT = 3000; 
app.set('view engine','ejs');
app.use(cookieParser())
app.use(express.static('images'));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyp.urlencoded({extended:true}));
const router = require("./Routes/routes.js")
console.log(router)
app.use("/",router)
app.listen(PORT,(error)=>{
    if(!error){              
        console.log("Server is Succsessfully Running and App is listening on port "+PORT);
    }else{
        console.log(error);
    }
});