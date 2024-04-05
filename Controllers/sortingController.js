const url = require("url");
const mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function sorting(req,res){
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
}
module.exports={sorting}