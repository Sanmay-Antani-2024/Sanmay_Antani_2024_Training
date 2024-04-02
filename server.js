const path = require('path');                       
const express=require('express');
const app = express(); 
const bodyp=require('body-parser');
const url = require("url");
const mysql=require("mysql");
const { createHash } = require('crypto');
const moment =require('moment');
const jwt=require('jsonwebtoken');
const { error } = require('console');
const cookieParser=require('cookie-parser')
const PORT = 3000; 
let timer=undefined
let Linkstatus=1
let randomString=undefined;
let usid=undefined;
app.set('view engine','ejs');
app.use(cookieParser())
app.use(express.static('images'));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyp.urlencoded({extended:true}));
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
app.get("/",(req,res)=>{
    res.render("reg")
})
function displayPasswordPage(){    
    app.get("/"+randomString,(req,res)=>{
        if(Linkstatus==1){
            res.render("passWord",{uid:usid,status:200})
        }else if(Linkstatus==0){
            randomString=Math.random().toString(36).slice(2)  
            displayPasswordPage()            
            Linkstatus=1
            res.render("passWord",{uid:usid,status:201,newrandlink:randomString})            
        }
    })    
}
app.post("/insert/Pass",(req,res)=>{
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
})
app.post("/",async(req,res)=>{
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
        displayPasswordPage()
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
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async (req,res)=>{
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
    
})

function verification(req,res,next){   
    if(req.cookies.token!=undefined){
        let ver=jwt.verify(req.cookies.token,"12S03A",{
            algorithm:"HS256"
        });        
        if(parseInt(ver.exp)>=Date.now()){            
            next()
        }else{
            console.log("This is upper else")
            res.redirect("/login")
        }
    }else{
        console.log("This is lower else")
        // console.log(req.Cookies.token)
        res.redirect("/login")
    }    
}

app.use("/homePage",verification)
app.get("/homePage",(req,res)=>{
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
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/login")
})

app.use("/kookoo",verification)
app.get("/kookoo",(req,res)=>{
    res.render("koo-koo-cube_SanmayAntani")
})

app.use("/tictactoe",verification)
app.get("/tictactoe",(req,res)=>{
    res.render("tictactoe")
})

app.use("/DT",verification)
app.get("/DT",(req,res)=>{
    res.render("Dynamic_Table_Sanmay_Antani")
})

app.use("/ET",verification)
app.get("/ET",(req,res)=>{
    res.render("chessOfEvents")
})

app.use("/delSearch",verification)
app.get('/delSearch',(req,res)=>{
    let lstDels=['_','{','$','}',':'];
    let sNames=""
    let cNums=""
    let emails=""
    let Ages=""
    let AadharCardNo=""
    const fullUrl = url.parse(req.url, true);
    let delTxt=fullUrl.query.delQueryTxt;    
    if(delTxt!=undefined){
        let cnt=0
        let sign="";
        while(cnt<delTxt.length){
            if(lstDels.includes(delTxt.charAt(cnt))){
                if(!(lstDels.includes(delTxt.charAt(cnt-1))||cnt==(delTxt.length-1))){                                                 
                    switch(delTxt.charAt(cnt)){
                        case '_':               
                            if(sNames!=""){         
                                sNames=sNames+","                        
                            }
                            break;
                        case '{':
                            if(cNums!=""){
                                cNums=cNums+","
                            }
                            break;
                        case '$':
                            if(emails!=""){
                                emails=emails+","
                            }
                            break;
                        case '}':
                            if(Ages!=""){
                                Ages=Ages+","
                            }
                            break;
                        case ':':
                            if(AadharCardNo!=""){
                                AadharCardNo=AadharCardNo+","
                            }
                            break;
                        default:
                            console.log("Good");                            
                    }
                }          
                sign=delTxt.charAt(cnt);
            }else{
                switch(sign){
                    case '_':
                        if(delTxt.charAt(cnt)=="%"){
                            sNames=sNames+"\\";
                        }
                        sNames=sNames+delTxt.charAt(cnt)
                        break;
                    case '{':
                        if(delTxt.charAt(cnt)=="%"){
                            cNums=cNums+"\\";
                        }
                        cNums=cNums+delTxt.charAt(cnt)
                        break;
                    case '$':
                        if(delTxt.charAt(cnt)=="%"){
                            emails=emails+"\\";
                        }
                        emails=emails+delTxt.charAt(cnt)
                        break;
                    case '}':
                        if(delTxt.charAt(cnt)=="%"){
                            Ages=Ages+"\\";
                        }
                        Ages=Ages+delTxt.charAt(cnt)
                        break;
                    case ':':
                        if(delTxt.charAt(cnt)=="%"){
                            AadharCardNo=AadharCardNo+"\\";
                        }
                        AadharCardNo=AadharCardNo+delTxt.charAt(cnt)
                        break;
                    default:
                        console.log("default");
                }
            }
            cnt=cnt+1
        }
        let sNamesArr=sNames.split(',')
        let cNumsArr=cNums.split(',')
        let emailsArr=emails.split(',')
        let AgesArr=Ages.split(',')
        let AadharCardNoArr=AadharCardNo.split(',')
        console.log("Names: "+sNamesArr);
        console.log("\nContact: "+cNumsArr);
        console.log("\nEmails: "+emailsArr);
        console.log("\nAges:"+AgesArr);
        console.log("\nAadhar Card: "+AadharCardNoArr);
        sql="select * from StudentMasterCommand where"
        if(sNames!=""){
            if(sNamesArr.length==1){
                sql=sql+" studentName like '%"+sNamesArr[0]+"%' and"
            }else{
                for(let i=0;i<sNamesArr.length;i++){
                    if(i==(sNamesArr.length-1)){
                        sql=sql+" studentName like '%"+sNamesArr[i]+"%') and"
                    }else if(i==0){
                        sql=sql+" (studentName like '%"+sNamesArr[i]+"%' or"
                    }
                    else{
                        sql=sql+" studentName like '%"+sNamesArr[i]+"%' or"
                    }
                }
            }
        }
        if(cNums!=""){
            if(cNumsArr.length==1){
                sql=sql+" contact_no like '%"+cNumsArr[0]+"%' and"
            }else{
                for(let i=0;i<cNumsArr.length;i++){
                    if(i==(cNumsArr.length-1)){
                        sql=sql+" contact_no like '%"+cNumsArr[i]+"%') and"
                    }else if(i==0){
                        sql=sql+" (contact_no like '%"+cNumsArr[i]+"%' or"
                    }
                    else{
                        sql=sql+" contact_no like '%"+cNumsArr[i]+"%' or"
                    }
                }
            }
        }
        if(emails!=""){
            if(emailsArr.length==1){
                sql=sql+" emailID like '%"+emailsArr[0]+"%' and"
            }else{
                for(let i=0;i<emailsArr.length;i++){
                    if(i==(emailsArr.length-1)){
                        sql=sql+" emailID like '%"+emailsArr[i]+"%') and"
                    }else if(i==0){
                        sql=sql+" (emailID like '%"+emailsArr[i]+"%' or"
                    }
                    else{
                        sql=sql+" emailID like '%"+emailsArr[i]+"%' or"
                    }
                }
            }
        }
        if(Ages!=""){
            if(AgesArr.length==1){
                sql=sql+" age like '%"+AgesArr[0]+"%' and"
            }else{
                for(let i=0;i<AgesArr.length;i++){
                    if(i==(AgesArr.length-1)){
                        sql=sql+" age like '%"+AgesArr[i]+"%') and"
                    }else if(i==0){
                        sql=sql+" (age like '%"+AgesArr[i]+"%' or"
                    }else{
                        sql=sql+" age like '%"+AgesArr[i]+"%' or"
                    }
                }
            }
        }
        if(AadharCardNo!=""){
            if(AadharCardNoArr.length==1){
                sql=sql+" AadharCardNo like '%"+AadharCardNoArr[0]+"%' and"
            }else{
                for(let i=0;i<AadharCardNoArr.length;i++){
                    if(i==(AadharCardNoArr.length-1)){
                        sql=sql+" AadharCardNo like '%"+AadharCardNoArr[i]+"%') and"
                    }else if(i==0){
                        sql=sql+" (AadharCardNo like '%"+AadharCardNoArr[i]+"%' or"
                    }else{
                        sql=sql+" AadharCardNo like '%"+AadharCardNoArr[i]+"%' or"
                    }
                }
            }
        }
        sql=sql.substring(0, sql.length-3);
        sql+=" limit 200";
        console.log(sql);
        con.query(sql,function(err,result){
            if(err){
                res.render("del_search",{s:undefined,txtQry:undefined})
            }else{  
                res.render('del_search',{s:result,txtQry:delTxt}); 
            }
        });
    }else{
        res.render("del_search",{s:undefined,txtQry:undefined})
    }
})

app.use("/sorting",verification)
app.get('/sorting',(req,res) => {  
    const fullUrl = url.parse(req.url, true);
    var curPage=fullUrl.query.pageID;
    const month=fullUrl.query.selMonth; 
    const field=fullUrl.query.field;  
    let order=fullUrl.query.order;
    let Ofield=fullUrl.query.Ofield;
    if(curPage==undefined){
        curPage=1
    }
    if(order==undefined){
        order="ASC"
        Ofield="id"
    }
    if(month==undefined){        
        const sql="select AttendenceJan2024.stID as id,studentMasterAttRep.studentName as name,sum(AttendenceJan2024.atStatus) as pdays,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as percent from studentMasterAttRep left join AttendenceJan2024 on AttendenceJan2024.stID=studentMasterAttRep.stID where month(AttendenceJan2024.dayDate)='12' group by AttendenceJan2024.stID order by "+Ofield+" "+order+" limit "+(curPage-1)*20+",20";

        con.query(sql,function(err,result){
            if(err){
                throw err;
            }else{
                res.render('attendenceReportSort',{s:result,PID:curPage,selMonth:12,cickedOrder:order,clickedOfield:Ofield}); 
            }
        });   
    }else{
        const sql="select AttendenceJan2024.stID as id,studentMasterAttRep.studentName as name,sum(AttendenceJan2024.atStatus) as pdays,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as percent from studentMasterAttRep left join AttendenceJan2024 on AttendenceJan2024.stID=studentMasterAttRep.stID where month(AttendenceJan2024.dayDate)='"+month+"' group by AttendenceJan2024.stID order by "+Ofield+" "+order+" limit "+(curPage-1)*20+",20";

        con.query(sql,function(err,result){
            if(err){
                throw err;
            }else{
                res.render('attendenceReportSort',{s:result,PID:curPage,selMonth:month,cickedOrder:order,clickedOfield:Ofield}); 
            }
        });   
    }
});

app.use("/filter",verification)
app.get('/filter',(req,res)=>{
    const fullUrl = url.parse(req.url, true);
    var curPage=fullUrl.query.pageID;
    let month=fullUrl.query.selMonth;    
    let stID=fullUrl.query.selSID;
    let sName=fullUrl.query.filterSname;
    let AO=fullUrl.query.selAndOr;
    let pDaysFrom=fullUrl.query.filterPresentDayFrom;
    let pDaysTo=fullUrl.query.filterPresentDayTo;
    let pPerFrom=fullUrl.query.filterPresentPerFrom;
    let pPerTo=fullUrl.query.filterPresentPerTo;
    let sql="";
    let mainSql="";
    let mainSqlCnt=0;
    let cnt=0;
    if(curPage==undefined){
        curPage=1
    }
    if(month==undefined){
        month=12
    }                 
    let res1=undefined;
    sql="select stID from studentMasterAttRep";
    con.query(sql,function(err,result){
      if(err){
          throw err;
      }else{
         res1=result;
      }
  });   
    if(stID==undefined){             
        if(sName!=undefined){
            mainSql="select AttendenceJan2024.stID as id,studentMasterAttRep.studentName as name,sum(AttendenceJan2024.atStatus) as pdays,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as percent from studentMasterAttRep left join AttendenceJan2024 on AttendenceJan2024.stID=studentMasterAttRep.stID where studentMasterAttRep.studentName like'%"+sName+"%' "+AO+" month(AttendenceJan2024.dayDate)='"+month+"' group by AttendenceJan2024.stID having sum(AttendenceJan2024.atStatus) between "+pDaysFrom+" AND "+pDaysTo+" "+AO+" (100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) between "+pPerFrom+" AND "+pPerTo;
            sql=mainSql+" limit "+(curPage-1)*20+",20";
            con.query(mainSql,function(err,result){
                if(err){
                    throw err;
                }else{
                    mainSqlCnt=result.length;
                }
            });
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    res.render('filterPanel',{s:result,PID:curPage,selMonth:month,sid:undefined,sidRes:res1,studentN:sName,andor:AO,resLen:mainSqlCnt,pDf:pDaysFrom,pDt:pDaysTo,pPf:pPerFrom,pPt:pPerTo}); 
                }
            });
        }else{      
            mainSql="select AttendenceJan2024.stID as id,studentMasterAttRep.studentName as name,sum(AttendenceJan2024.atStatus) as pdays,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as percent from studentMasterAttRep left join AttendenceJan2024 on AttendenceJan2024.stID=studentMasterAttRep.stID where month(AttendenceJan2024.dayDate)='"+month+"' group by AttendenceJan2024.stID";
          sql=mainSql+" limit "+(curPage-1)*20+",20";
          con.query(mainSql,function(err,result){
            if(err){
                throw err;
            }else{
                mainSqlCnt=result.length; 
            }
        }); 
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    res.render('filterPanel',{s:result,PID:curPage,selMonth:month,sid:undefined,sidRes:res1,studentN:undefined,andor:undefined,resLen:mainSqlCnt,pDf:undefined,pDt:undefined,pPf:undefined,pPt:undefined}); 
                }
            });          
        }
    }else{        
        mainSql="select AttendenceJan2024.stID as id,studentMasterAttRep.studentName as name,sum(AttendenceJan2024.atStatus) as pdays,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as percent from studentMasterAttRep left join AttendenceJan2024 on AttendenceJan2024.stID=studentMasterAttRep.stID where month(AttendenceJan2024.dayDate)='"+month+"' and AttendenceJan2024.stID='"+stID+"' group by AttendenceJan2024.stID";
        con.query(mainSql,function(err,result){
            if(err){
                throw err;
            }else{
                mainSqlCnt=result.length; 
            }
        });
        sql=mainSql+" limit "+(curPage-1)*20+",20";
            con.query(sql,function(err,result){
                if(err){
                    throw err;
                }else{
                    res.render('filterPanel',{s:result,PID:curPage,selMonth:month,sid:stID,sidRes:res1,studentN:undefined,andor:undefined,resLen:mainSqlCnt,pDf:undefined,pDt:undefined,pPf:undefined,pPt:undefined}); 
                }
            });   
    }
});

app.use("/result",verification)
app.get('/result',(req,res)=>{
    const fullUrl = url.parse(req.url, true);
    var curPage=fullUrl.query.pageID;
    if(curPage==undefined){
        curPage=1
    }
    const sql="select studentMasterAttRep.studentName as  name,resultAttRep.stID as id,sum(resultAttRep.ObtainMarks) as ObtainMarks,resultAttRep.examTypeID from studentMasterAttRep left join resultAttRep on studentMasterAttRep.stID=resultAttRep.stID group by resultAttRep.stID,resultAttRep.examTypeID,studentMasterAttRep.studentName limit "+(curPage-1)*120+",120";
        con.query(sql,function(err,result){
            if(err){
                throw err;
            }else{
                res.render('resultReport',{s:result,PID:curPage}); 
            }
        });   
});

app.use("/reportCard",verification)
app.get('/reportCard',(req,res)=>{
    const fullUrl = url.parse(req.url, true);
    const sid=fullUrl.query.sid;    
    const sname=fullUrl.query.sname;
    const sql="select subjectMaster.subjectName as subname,resultAttRep.ObtainMarks as ObtainMarks,resultAttRep.examTypeID as examType,(100*sum(AttendenceJan2024.atStatus))/count(AttendenceJan2024.atStatus) as presentPer from subjectMaster left join resultAttRep on subjectMaster.subjectID=resultAttRep.subjectID left join AttendenceJan2024 on resultAttRep.stID=AttendenceJan2024.stID where resultAttRep.stID='"+sid+"' group by resultAttRep.examTypeID,subjectMaster.subjectName,resultAttRep.ObtainMarks";
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            res.render('reportCard',{s:result,id:sid,name:sname}); 
        }
    });   
});

app.use("/jaf",verification)
app.get('/jaf',(req,res)=>{
    let sql="select * from tblApplicantMaster"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            res.render('listing',{r:result});
        }
    });    
})

app.use("/i",verification)
app.get('/i',(req,res)=>{
    res.render("insert_applicant") 
})

app.use("/insert",verification)
app.get('/insert',(req,res)=>{
    const fullUrl = url.parse(req.url, true);
    let id=fullUrl.query.id
    if(id==undefined){
        res.redirect("insert_applicant",{basicR:undefined,eduR:undefined});
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


})

app.use("/insert/basic",verification)
app.post('/insert/basic',(req,res)=>{
    let data = req.body;
    console.log(data);   
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
})

app.use("/display/basic",verification)
app.post('/display/basic',(req,res)=>{
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
})
let uid=undefined

app.use("/update/basic",verification)
app.post('/update/basic',(req,res)=>{
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
})

app.use("/display/edu",verification)
app.post('/display/edu',(req,res)=>{
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
})

app.use("/update/edu",verification)
app.post('/update/edu',(req,res)=>{
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
  
})

app.use("/insert/edu",verification)
app.post('/insert/edu',(req,res)=>{
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
})

app.use("/display/Wexp",verification)
app.post('/display/Wexp',(req,res)=>{
    let sql="select * from WorkExp where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying edu")            
            res.send(result)
        }
    });   
})

app.use("/update/Wexp",verification)
app.post('/update/Wexp',(req,res)=>{
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
})

app.use("/insert/Wexp",verification)
app.post('/insert/Wexp',(req,res)=>{
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
})

app.use("/display/langKnown",verification)
app.post('/display/langKnown',(req,res)=>{
    let sql="select * from lKnown where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying lKnown")            
            res.send(result)
        }
    });   
})

app.use("/insert/langKnown",verification)
app.post('/insert/langKnown',(req,res)=>{
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

});

app.use("/update/langKnown",verification)
app.post('/update/langKnown',(req,res)=>{
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

});

app.use("/display/techKnown",verification)
app.post('/display/techKnown',(req,res)=>{
    let sql="select * from techKnown where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
})

app.use("/update/techKnown",verification)
app.post('/update/techKnown',(req,res)=>{
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
})

app.use("/insert/techKnown",verification)
app.post('/insert/techKnown',(req,res)=>{    
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
})

app.use("/display/ref",verification)
app.post('/display/ref',(req,res)=>{
    let sql="select * from ref where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
})

app.use("/update/ref",verification)
app.post('/update/ref',(req,res)=>{
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
})

app.use("/insert/ref",verification)
app.post('/insert/ref',(req,res)=>{  
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
})

app.use("/display/pref",verification)
app.post('/display/pref',(req,res)=>{
    let sql="select * from prefer where applID='"+uid+"'"
    con.query(sql,function(err,result){
        if(err){
            throw err;
        }else{
            console.log("displaying techKnown")            
            res.send(result)
        }
    });  
})

app.use("/update/pref",verification)
app.post('/update/pref',(req,res)=>{
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
})

app.use("/insert/pref",verification)
app.post('/insert/pref',(req,res)=>{  
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
})            

app.use("/insert",verification)
app.post('/insert',(req,res)=>{      
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
    
})

var sql=" ";
var sqlNoLimitCnt=0;
var baseSql=" ";

app.use("/dqe",verification)
app.post('/dqe',(req,res)=>{    
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
    
})

app.get('/dqe',(req,res)=>{     
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
})

app.get("/api",(req,res)=>{
    const fullUrl = url.parse(req.url,true);
    if(fullUrl.query.id==undefined){
        res.render("userData")
    }else{
        res.render("searchUser")
    }
})


app.listen(PORT,(error)=>{
    if(!error){              
        console.log("Server is Succsessfully Running and App is listening on port "+PORT);
    }else{
        console.log(error);
    }
});