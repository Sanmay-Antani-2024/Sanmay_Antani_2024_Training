const url = require("url");
const mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function delSearchController(req,res){
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
}
module.exports={delSearchController}