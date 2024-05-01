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
let con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
let Linkstatus=1
let randomString=undefined;
let usid=undefined;
function getReg(req,res){
    res.render("reg")
}
function routedisplayPasswordPage(req,res){
    if(Linkstatus==1){
        res.render("passWord",{uid:usid,status:200})
    }else if(Linkstatus==0){
        randomString=Math.random().toString(36).slice(2)  
        req.params={"code":randomString}           
        Linkstatus=1
        res.render("passWord",{uid:usid,status:201,newrandlink:randomString})            
    }
}

function insertPass (req,res){
    let data=req.body
    let randNum=(Math.random()*10000).toString().split(".")[0]    
    let encPass=createHash('md5').update(randNum+data.p).digest("hex").toString();    
    sql="update Users_Regs_Master set password=? , salt=? , status=? where id=?"
    con.query(sql,[encPass,randNum,1,usid],function(err,result){
        if(err){
            throw err;
        }else{            
            console.log("Salt: "+randNum)
            console.log("Reg Pass: "+encPass)
            res.send({status:200})              
        }
    })                                     
}
async function submitRegistration (req,res){
    Linkstatus=1
    let data=req.body
    console.log(data)
    checkExistAndActive(data)
    async function checkExistAndActive(rec){
        sql="select * from Users_Regs_Master where email=? and status=1"
        con.query(sql,[rec.email],function(err,result){
            if(err){
                throw err;
            }else{
                if(result.length==0){
                    checkExistAndInactive(rec)  
                }else{
                    res.send({status:201})     
                }                                        
            }
        });
    }
    async function checkExistAndInactive(rec){
        sql="select * from Users_Regs_Master where email=? and status=0"
        con.query(sql,[rec.email],function(err,result){
            if(err){
                throw err;
            }else{
                if(result.length==0){
                    normalReg(rec)  
                }else{
                    res.send({status:202})     
                }                                        
            }
        });
    }
    async function normalReg(){        
        sql="insert into Users_Regs_Master(Fname,Lname,email,Contact,gender,status) values(?,?,?,?,?,?)"
        await normalRegQuery(data) 
        Linkstatus=1        
        setTimeout(()=>{
            Linkstatus=0
        }, 10000);        
        req.params={"code":randomString}           
        res.send({status:200,"uid":usid,"random":randomString})                     
    }
    function normalRegQuery(rec){        
        let pr=new Promise((resolve,reject)=>{
            con.query(sql,[rec.Fname,rec.Lname,rec.email,rec.Contact,rec.gender,0],function(err,result){
                if(err){
                    throw err;
                }else{
                    randomString=Math.random().toString(36).slice(2)
                    usid=result.insertId
                    console.log("first time reg of user")            
                    resolve()                            
                }
            });
        })
        return pr
    }
}
let tempObj={getReg,insertPass,submitRegistration,routedisplayPasswordPage}
module.exports=tempObj
