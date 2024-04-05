const url = require("url");
const mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function filter(req,res){
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
}
module.exports={filter}