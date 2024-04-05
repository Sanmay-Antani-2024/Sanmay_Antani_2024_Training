function logout(req,res){
    res.clearCookie("token")
    res.redirect("/login/login")
}
module.exports={logout}