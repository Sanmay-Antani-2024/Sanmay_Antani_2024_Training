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
function showlogin(req,res){
    res.render("login")
}

async function dologin(req,res){
    let data=req.body
    let result1=undefined
    let sql1="select password,salt from Users_Regs_Master where email=?"
    await get_salt_password(data)
    if(result1!=undefined){
        let sql2="select id,email from Users_Regs_Master where email=? and password=?"        
        await login()
        function login(){
            let pr=new Promise((resolve,reject)=>{
                con.query(sql2,[data.uname,createHash('md5').update(result1[0].salt+data.pass).digest("hex").toString()],function(err,result){
                    if(err){
                        throw err;
                    }else{
                        if(result.length==0){
                            console.log("Incorrect User Name Or Password!!")
                            res.send({status:404})
                        }else{
                            console.log("Sucessfully logged in!")
                            let token=jwt.sign(
                                {
                                    iss:"Sanmay",
                                    iat:Date.now(),
                                    exp:Date.now()+(60*60000),
                                    message:result[0].email
                                },"12S03A",
                                {
                                    algorithm:"HS256"
                                }                                                
                            );
                            console.log(token)
                            res.cookie("token",token)                            
                            res.send({status:200})
                        }       
                        result1=result
                        resolve()
                    }
                });
            }) 
            return pr           
        }
    }
    function get_salt_password(rec){
        let pr= new Promise((resolve,reject)=>{
            con.query(sql1,[rec.uname],function(err,result){
                if(err){
                    throw err;
                }else{
                    if(result.length==0){
                        res.send({status:404})
                        resolve()             
                    }else{
                        result1=result           
                        resolve()                
                    }                                                    
                }
            });
        })            
        return pr
    }
    
}
module.exports={showlogin,dologin}