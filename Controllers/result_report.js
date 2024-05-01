const url = require("url");
const mysql=require("mysql");
let con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function result(req,res){
    const fullUrl = url.parse(req.url, true);
    let curPage=fullUrl.query.pageID;
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
}

function reportCard(req,res){
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
}
module.exports={result,reportCard}