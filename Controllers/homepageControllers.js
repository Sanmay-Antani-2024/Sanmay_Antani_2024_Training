const path = require('path');                       
const express=require('express');
const app = express.Router(); 
const bodyp=require('body-parser');
const url = require("url");
const mysql=require("mysql");
const { createHash } = require('crypto');
const moment =require('moment');
const jwt=require('jsonwebtoken');
const { error } = require('console');
const cookieParser=require('cookie-parser')
const PORT = 3000; 
let usid=undefined;
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function homePageDisplay(req,res){
    let sql="select * from Users_Regs_Master where email=?"
    let ver=jwt.verify(req.cookies.token,"12S03A",{
        algorithm:"HS256"
    }); 
    con.query(sql,[ver.message],(err,result)=>{
        if(err){
            throw err
        }else{
            console.log(result[0].Fname)
            res.render("homePage",{fname:result[0].Fname})
        }
    })
}
module.exports={homePageDisplay}