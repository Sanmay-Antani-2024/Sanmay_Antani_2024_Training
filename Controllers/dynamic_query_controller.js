const url = require("url");
const moment =require('moment');
const mysql=require("mysql");
var sql=" ";
var sqlNoLimitCnt=0;
var baseSql=" ";
const id=undefined
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function dqe_post(req,res){    
    console.log(req.body)
    baseSql=req.body.selQuery
    con.query(baseSql,function(err,result,cols){
        if(err){
            console.log("Hi")
            res.render('dynamic',{s:undefined,PID:1,er:err,bQuery:baseSql})
        }else{                        
            sqlNoLimitCnt=result.length
            sql=baseSql+" limit 0,20"
            con.query(sql,function(err,result,cols){
                if(err){
                    throw err
                }else{                        
                    res.render('dynamic',{s:result,col:cols,PID:1,recCnt:sqlNoLimitCnt,er:undefined,bQuery:baseSql})
                }
            })
        }
    })    
}

function dqe_get(req,res){     
    const fullUrl = url.parse(req.url, true)       
    var curPage=fullUrl.query.pageID
    if(curPage==undefined){
        curPage=1
    }
    if(baseSql!=" "){
        con.query(baseSql,function(err,result,cols){
            if(err){
                res.render('dynamic',{s:undefined,PID:curPage,er:err,bQuery:baseSql})
                // throw err
            }else{                        
                sqlNoLimitCnt=result.length 
            }
        });
        sql=baseSql+" limit "+((curPage-1)*20)+",20"
        con.query(sql,function(err,result,cols){
            if(err){
                throw err
            }else{                        
                res.render('dynamic',{s:result,col:cols,PID:curPage,recCnt:sqlNoLimitCnt,er:undefined,bQuery:baseSql})
            }
        })
    }else{
        res.render('dynamic',{s:undefined,PID:curPage,er:undefined,bQuery:undefined})
    }    
}

module.exports={dqe_get,dqe_post}