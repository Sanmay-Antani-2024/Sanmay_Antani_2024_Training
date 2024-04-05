const url = require("url");
const mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "regdb_22_03_2024"
});
function api(req,res){
    const fullUrl = url.parse(req.url,true);
    if(fullUrl.query.id==undefined){
        res.render("userData")
    }else{
        res.render("searchUser")
    }
}
module.exports={api}