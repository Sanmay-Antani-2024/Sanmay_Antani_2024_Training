const url = require("url");
const moment =require('moment');
const mysql=require("mysql");
const id=undefined
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function jaf(req,res){
    let sql="select * from tblApplicantMaster"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            res.render('listing',{r:result});
        }
    });    
}

function i_get(req,res){
    res.render("insert_applicant") 
}

function insert_get(req,res){
    const fullUrl = url.parse(req.url, true);
    let id=fullUrl.query.id
    if(id==undefined){
        res.render("insert_applicant",{basicR:undefined,eduR:undefined});
    }else{
        async function showData(){
            let rBasic=await showBasic() 
            let rEduction= await showEducation()                         
            console.log(rBasic)
            console.log(rEduction)
            res.send({basicR:rBasic,eduR:rEduction});                   
        }
        showData()
    }
    function showBasic(){        
        let sql="select * from tblApplicantMaster where applID='"+id+"'"
        let pr=new Promise((resolve,reject)=>{
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    console.log("working")
                    // rBasic=
                    resolve(result)                    
                }
            });
        })
        return pr         
    }
    function showEducation(){
        let sql="select * from tblSchool where applID="+id
        let pr=new Promise((resolve,reject)=>{
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    console.log("working "+JSON.stringify(result))
                    // rEduction=
                    resolve(result)                    
                }
            });
        })
            return pr
    }


}

function insert_basic_post(req,res){
    let data = req.body;
    let oldDate=data.txtDOB
    let tempSplit=oldDate.split("/")
    let sql="insert into tblApplicantMaster(fName,lName,gender,designation,relationSt,add1,add2,dob,city,state,zip,email,contact) values('"+data.txtFname+"','"+data.txtLname+"','"+data.rdbGender+"','"+data.txtDesig+"','"+data.RS+"','"+data.txtAdd1+"','"+data.txtAdd2+"','"+tempSplit[2]+"-"+tempSplit[1]+"-"+tempSplit[0]+"','"+data.txtCity+"','"+data.selState+"','"+data.txtZip+"','"+data.txtEmail+"','"+data.txtPNumber+"')"
    con.query(sql,function(err,result){
        if(err){
            console.log(sql)
            throw err;
        }else{            
            console.log("inserted!!_basic")
            console.log(result.insertId)
            res.send({id:result.insertId})
        }
    })  
}

function display_basic_post(req,res){
    let data=req.body
    let sql="select * from tblApplicantMaster where applID='"+data.uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("working")            
            result[0].dob=moment(result[0].dob).utc().format("DD/MM/YYYY")
            res.send(result)
        }
    });   
}
let uid=undefined
function update_basic(req,res){
    let data=req.body
    let oldDate=data.txtDOB
    let tempSplit=oldDate.split("/")
    uid=data.id
    let sql="update tblApplicantMaster set fName='"+data.txtFname+"',lName='"+data.txtLname+"',gender='"+data.rdbGender+"',designation='"+data.txtDesig+"',relationSt='"+data.RS+"',add1='"+data.txtAdd1+"',add2='"+data.txtAdd2+"',dob='"+tempSplit[2]+"-"+tempSplit[1]+"-"+tempSplit[0]+"',city='"+data.txtCity+"',state='"+data.selState+"',zip='"+data.txtZip+"',email='"+data.txtEmail+"',contact='"+data.txtPNumber+"' where applID='"+data.id+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("basic details updated")                        
        }
    });
    res.end();
}

function display_edu_post(req,res){
    let data=req.body
    console.log(uid)
    let sql="select * from tblSchool where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying edu")            
            res.send(result)
        }
    });   
}

function update_edu_post(req,res){
    sql=""
    let data=req.body    
    console.log(data)
    let courses=data.course.split(",")
    let pys=data.py.split(",")
    let pers=data.per.split(",")
    // res.send('inserted');        
    courses.forEach((item,index,arr) => {
        if(item!=""){
            if(index==0){
                sql="update tblSchool set board='"+item+"',passYear="+pys[index]+",percent="+pers[index]+" where applID='"+uid+"' and std='SSC'" 
            }else if(index==1){
                sql="update tblSchool set board='"+item+"',passYear='"+pys[index]+"',percent='"+pers[index]+"' where applID="+uid+" and std='HSC'"  
            }else if(index==2){
                sql="update tblSchool set board='"+item+"',passYear='"+pys[index]+"',percent='"+pers[index]+"' where applID="+uid+" and std='Graduation'"   
            }else{
                sql="update tblSchool set board='"+item+"',passYear='"+pys[index]+"',percent='"+pers[index]+"' where applID="+uid+" and std='Master'"  
            }
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    if(result.affectedRows==0){                      
                        if(item!=""){
                            if(index==0){
                                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+uid+",'"+item+"','"+pys[index]+"','"+pers[index]+"','SSC')"
                            }else if(index==1){
                                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+uid+",'"+item+"','"+pys[index]+"','"+pers[index]+"','HSC')"
                            }else if(index==2){
                                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+uid+",'"+item+"','"+pys[index]+"','"+pers[index]+"','Graduation')"
                            }else{
                                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+uid+",'"+item+"','"+pys[index]+"','"+pers[index]+"','Master')"
                            }
                            con.query(sql,function(err,result){
                                if(err){
                                    throw err;
                                }else{
                                    console.log("inserted!!_education_for_updation")
                                        // id=result.insertId                    
                                }
                            }); 
                        }             
                        
                    }
                    console.log("updated!!_education")                                     
                }
            });             
        }             
    });
    res.end()  
}

function insert_edu_post(req,res){
    let data = req.body;
    sql=""
    console.log(data)
    let courses=data.course.split(",")
    let pys=data.py.split(",")
    let pers=data.per.split(",")
    // res.send('inserted');        
    courses.forEach((item,index,arr) => {
        if(item!=""){
            if(index==0){
                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+data.id+",'"+item+"','"+pys[index]+"','"+pers[index]+"','SSC')"
            }else if(index==1){
                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+data.id+",'"+item+"','"+pys[index]+"','"+pers[index]+"','HSC')"
            }else if(index==2){
                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+data.id+",'"+item+"','"+pys[index]+"','"+pers[index]+"','Graduation')"
            }else{
                sql="insert into tblSchool(applID,board,passYear,percent,std) values("+data.id+",'"+item+"','"+pys[index]+"','"+pers[index]+"','Master')"
            }
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    console.log("inserted!!_education")
                    // id=result.insertId                    
                }
            }); 
        }             
    });
}

function display_Wexp_post(req,res){
    let sql="select * from WorkExp where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying edu")            
            res.send(result)
        }
    });   
}

function update_Wexp_post(req,res){
    let data = req.body;
    sql=""
    console.log(data)
    console.log(data.companies)
    let companies=data.companies.split(",")
    let desigs=data.desigs.split(",")
    let froms=data.froms.split(",")
    let tos=data.tos.split(",")
    companies.forEach((item,index,arr)=>{
        if(item!=""){
            sql="update WorkExp set designation='"+desigs[index]+"',fromWhen='"+froms[index]+"',toWhen='"+tos[index]+"' where applID='"+uid+"' and compName='"+item+"'"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    if(result.affectedRows==0){
                        sql="insert into WorkExp(applID,compName,designation,fromWhen,toWhen) values("+uid+",'"+item+"','"+desigs[index]+"','"+froms[index]+"','"+tos[index]+"')"
                        con.query(sql,function(err,result){
                            if(err){
                                console.log("Sql")
                                throw err;
                            }else{
                                console.log("workExp_inserted_for_updated")
                            }
                        });       
                    }
                    console.log("updated!!_work_Exp")
                }
            })                 
        }            
    })
    res.end()
}

function insert_Wexp_post(req,res){
    let data = req.body;
    sql=""
    console.log(data)
    console.log(data.companies)
    let companies=data.companies.split(",")
    let desigs=data.desigs.split(",")
    let froms=data.froms.split(",")
    let tos=data.tos.split(",")
    companies.forEach((item,index,arr)=>{
        if(item!=""){
            let tempFrom=froms[index].split("-")
            let tempTo=tos[index].split("-")
            sql="insert into WorkExp(applID,compName,designation,fromWhen,toWhen) values("+data.id+",'"+item+"','"+desigs[index]+"','"+tempFrom[2]+"-"+tempFrom[1]+"-"+tempFrom[0]+"','"+tempTo[2]+"-"+tempTo[1]+"-"+tempTo[0]+"')"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    console.log("inserted!!_work_Exp")
                }
            })                 
        }            
    })
}


function display_langKnown_post(req,res){
    let sql="select * from lKnown where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying lKnown")            
            res.send(result)
        }
    });   
}

function insert_langKnown_post(req,res){
    let data=req.body
    chkLangs=data.langs.split(',')
    chkReads=data.reads.split(',')
    chkWrites=data.writes.split(',')
    chkSpeaks=data.speaks.split(',')
    chkLangs.forEach((item,index,arr)=>{
        console.log(data)
        if(item!=""){
            let cR=0    
            let cW=0
            let cS=0
            if(chkReads[index]==1){
                cR=1
            }
            if(chkWrites[index]==1){
                cW=1
            }
            if(chkSpeaks[index]==1){
                cS=1
            }

            sql="insert into lKnown(applID,lID,canRead,canWrite,canSpeak) values("+data.id+","+item+","+cR+","+cW+","+cS+")"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    console.log("inserted!!_lKnown")
                }
            });                 
        }
    })

};

function update_langKnown_post(req,res){
    let data=req.body
    chkLangs=data.langs.split(',')
    chkReads=data.reads.split(',')
    chkWrites=data.writes.split(',')
    chkSpeaks=data.speaks.split(',')
    chkLangs.forEach((item,index,arr)=>{
        console.log(data)
        if(item!=""){
            let cR=0    
            let cW=0
            let cS=0
            if(chkReads[index]==1){
                cR=1
            }
            if(chkWrites[index]==1){
                cW=1
            }
            if(chkSpeaks[index]==1){
                cS=1
            }

            sql="update lKnown set lID='"+item+"',canRead='"+cR+"',canWrite='"+cW+"',canSpeak='"+cS+"' where applID='"+uid+"' and lID='"+item+"'" 
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    if(result.affectedRows==0){
                        sql="insert into lKnown(applID,lID,canRead,canWrite,canSpeak) values("+uid+","+item+","+cR+","+cW+","+cS+")"
                        con.query(sql,function(err,result){
                            if(err){
                                console.log("Sql")
                                throw err;
                            }else{
                                console.log("lKnown_inserted_for_updated")
                            }
                        });       
                    }
                    console.log("lKnown_updated")
                    res.end()
                }
            });                 
        }
    })

}

function display_techKnown_post(req,res){
    let sql="select * from techKnown where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
}

function update_techKnown_post(req,res){
    let data=req.body
    console.log(data)
    let techs=data.tech.split(",")  
    techs.forEach((item,index,arr)=>{
        if(item!=""){
            sql="update techKnown set level='"+data["level"+index]+"' where applID='"+uid+"' and techID='"+item+"'"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    if(result.affectedRows==0){
                        sql="insert into techKnown(applID,techID,level) values("+uid+","+item+",'"+data["level"+index]+"')"
                        con.query(sql,function(err,result){
                            if(err){
                                console.log("Sql")
                                throw err;
                            }else{
                                console.log("techKnown_inserted_for_updated")
                            }
                        });       
                    }
                    console.log("updated!!_techKnown")
                }
            })                 
        }            
    })
    res.end()
}

function insert_techKnown_post(req,res){    
    let data=req.body
    console.log(data)
    let techs=data.tech.split(",")  
    techs.forEach((item,index,arr)=>{
        if(item!=""){
            sql="insert into techKnown(applID,techID,level) values("+data.id+","+item+",'"+data["level"+index]+"')"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    console.log("inserted!!_techKnown")
                }
            })                 
        }            
    })
}

function display_ref_post(req,res){
    let sql="select * from ref where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
}

function update_ref_post(req,res){
    let data=req.body  
    let refNames=req.body.refName.split(",")
    let refNums=req.body.refNum.split(",")
    let refrels=req.body.refrel.split(",")
    refNames.forEach((item,index,arr)=>{
        if(item!=""){
            sql="update ref set Name='"+item+"',rel='"+refrels[index]+"' where applID='"+uid+"' and ContNum='"+refNums[index]+"'"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    if(result.affectedRows==0){
                        sql="insert into ref(applID,Name,ContNum,rel) values("+uid+",'"+item+"',"+refNums[index]+",'"+refrels[index]+"')"
                        con.query(sql,function(err,result){
                            if(err){
                                console.log("Sql")
                                throw err;
                            }else{
                                console.log("ref_inserted_for_updated")
                            }
                        });       
                    }
                    console.log("updated!!_ref")
                }
            })    
        }
    })
    res.end()
}

function insert_ref_post(req,res){  
    let data=req.body  
    let refNames=req.body.refName.split(",")
    let refNums=req.body.refNum.split(",")
    let refrels=req.body.refrel.split(",")
    refNames.forEach((item,index,arr)=>{
        if(item!=""){
            sql="insert into ref(applID,Name,ContNum,rel) values("+data.id+",'"+item+"',"+refNums[index]+",'"+refrels[index]+"')"
            con.query(sql,function(err,result){
                if(err){
                    console.log("Sql")
                    throw err;
                }else{
                    console.log("inserted!!_ref")
                }
            })    
        }
    })
}

function display_pref_post(req,res){
    let sql="select * from prefer where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
}

function update_pref_post(req,res){
    let data=req.body         
    sql="update prefer set noticePeriod='"+data.txtNP+"',expCTC='"+data.txtExpCTC+"',currCTC='"+data.txtCurrCTC+"',deptID='"+data.selpDept+"',loc='"+data.selploc+"' where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            console.log("Sql")
            throw err;
        }else{
            if(result.affectedRows==0){
                sql="insert into prefer(applID,loc,noticePeriod,expCTC,currCTC,deptID) values("+uid+",'"+data.selploc+"',"+data.txtNP+","+data.txtExpCTC+","+data.txtCurrCTC+","+data.selpDept+")"
                con.query(sql,function(err,result){
                    if(err){
                        console.log("Sql")
                        throw err;
                    }else{
                        console.log("ref_inserted_for_updated")
                        res.send({"status":200})
                    }
                });       
            }
            console.log("inserted!!_pref")
            res.send({"status":200})
        }
    })        
}

function insert_pref_post(req,res){  
    let data=req.body         
        sql="insert into prefer(applID,loc,noticePeriod,expCTC,currCTC,deptID) values("+data.id+",'"+data.selploc+"',"+data.txtNP+","+data.txtExpCTC+","+data.txtCurrCTC+","+data.selpDept+")"
        con.query(sql,function(err,result){
            if(err){
                console.log("Sql")
                throw err;
            }else{
                console.log("inserted!!_pref")
                res.send({"status":200})
            }
        })            
}    

function insert_post(req,res){      
    let data=req.body
    let oldDate=data.txtDOB
    let tempSplit=oldDate.split("/")

    let sql="insert into tblApplicantMaster(fName,lName,gender,designation,relationSt,add1,add2,dob,city,state,zip,email,contact) values('"+data.txtFname+"','"+data.txtLname+"','"+data.rdbGender+"','"+data.txtDesig+"','"+data.RS+"','"+data.txtAdd1+"','"+data.txtAdd2+"','"+tempSplit[2]+"-"+tempSplit[1]+"-"+tempSplit[0]+"','"+data.txtCity+"','"+data.selState+"','"+data.txtZip+"','"+data.txtEmail+"','"+data.txtPNumber+"')"
    let id=undefined    
    async function insert(){      
        await lastID()
        console.log(id)
        sql=""
        // res.send('inserted');        
        data["course"].forEach((item,index,arr) => {
            if(item!=""){
                if(index==0){
                    sql="insert into tblSchool(applID,board,passYear,percent,std) values("+id+",'"+item+"','"+data["py"][index]+"','"+data["per"][index]+"','SSC')"
                }else if(index==1){
                    sql="insert into tblSchool(applID,board,passYear,percent,std) values("+id+",'"+item+"','"+data["py"][index]+"','"+data["per"][index]+"','HSC')"
                }else if(index==2){
                    sql="insert into tblSchool(applID,board,passYear,percent,std) values("+id+",'"+item+"','"+data["py"][index]+"','"+data["per"][index]+"','Graduation')"
                }else{
                    sql="insert into tblSchool(applID,board,passYear,percent,std) values("+id+",'"+item+"','"+data["py"][index]+"','"+data["per"][index]+"','Master')"
                }
                con.query(sql,function(err,result){
                    if(err){
                        throw err;
                    }else{
                        console.log("inserted!!_education")
                        // id=result.insertId                    
                    }
                }); 
            }             
        });
        data.chkLang.forEach((item,index,arr)=>{
            console.log(data)
            if(item!=""){
                let cR=0    
                let cW=0
                let cS=0
                if(chkReads[index]==1){
                    cR=1
                }
                if(data.chkW[index]==1){
                    cW=1
                }
                if(data.chkSpeak[index]==1){
                    cS=1
                }

                sql="insert into lKnown(applID,lID,canRead,canWrite,canSpeak) values("+id+","+item+","+cR+","+cW+","+cS+")"
                con.query(sql,function(err,result){
                    if(err){
                        console.log("Sql")
                        throw err;
                    }else{
                        console.log("inserted!!_lKnown")
                    }
                });                 
            }
        })

        if("tech" in data){
            data.tech.forEach((item,index,arr)=>{
                if(item!=""){
                    sql="insert into techKnown(applID,techID,level) values("+id+","+item+",'"+data["level"+index]+"')"
                    con.query(sql,function(err,result){
                        if(err){
                            console.log("Sql")
                            throw err;
                        }else{
                            console.log("inserted!!_techKnown")
                        }
                    })                 
                }            
            })
        }

        if("weCompany" in data){
            data.weCompany.forEach((item,index,arr)=>{
                if(item!=""){
                    let tempFrom=data.weFrom[index].split("-")
                    let tempTo=data.weTo[index].split("-")
                    sql="insert into WorkExp(applID,compName,designation,fromWhen,toWhen) values("+id+",'"+item+"','"+data.weDesig[index]+"','"+tempFrom[2]+"-"+tempFrom[1]+"-"+tempFrom[0]+"','"+tempTo[2]+"-"+tempTo[1]+"-"+tempTo[0]+"')"
                    con.query(sql,function(err,result){
                        if(err){
                            console.log("Sql")
                            throw err;
                        }else{
                            console.log("inserted!!_work_Exp")
                        }
                    })                 
                }            
            })
        }

        if("refName" in data){
            data.refName.forEach((item,index,arr)=>{
                if(item!=""){
                    sql="insert into ref(applID,Name,ContNum,rel) values("+id+",'"+item+"',"+data.refNum[index]+",'"+data.refrel[index]+"')"
                    con.query(sql,function(err,result){
                        if(err){
                            console.log("Sql")
                            throw err;
                        }else{
                            console.log("inserted!!_ref")
                        }
                    })    
                }
            })
        }

        if("selploc" in data){
            if(data.selploc!=""){
                data.selploc.forEach((item,index,arr)=>{
                    sql="insert into prefer(applID,loc,noticePeriod,expCTC,currCTC,deptID) values("+id+",'"+item+"',"+data.txtNP+","+data.txtExpCTC+","+data.txtCurrCTC+","+data.selpDept+")"
                    con.query(sql,function(err,result){
                        if(err){
                            console.log("Sql")
                            throw err;
                        }else{
                            console.log("inserted!!_pref")
                        }
                    })    
                })
            }
        }                
    }    
    function lastID(){
        let pr=new Promise((resolve,reject)=>{
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    console.log("inserted!!_1")            
                    id=result.insertId
                    resolve()
                    // res.send('inserted',{data:JSON.stringify(req.body)});
                }
            });        
        })
        return pr
    }
    insert()    
}

module.exports={jaf,i_get,insert_get,insert_basic_post,display_basic_post,update_basic,insert_Wexp_post,insert_edu_post,insert_langKnown_post,insert_pref_post,insert_ref_post,insert_techKnown_post,display_Wexp_post,display_edu_post,display_langKnown_post,display_pref_post,display_ref_post,display_techKnown_post,update_Wexp_post,update_edu_post,update_langKnown_post,update_pref_post,update_ref_post,update_techKnown_post}