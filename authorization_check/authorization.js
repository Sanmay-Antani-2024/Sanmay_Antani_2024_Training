const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser')

function verification(req,res,next){   
    if(req.cookies.token!=undefined){
        let ver=jwt.verify(req.cookies.token,"12S03A",{
            algorithm:"HS256"
        });        
        if(parseInt(ver.exp)>=Date.now()){
            next()
        }else{
            console.log("This is upper else")
            res.redirect("/login/login")
        }
    }else{
        console.log("This is lower else")
        // console.log(req.Cookies.token)
        res.redirect("/login/login")
    }    
}
module.exports=verification