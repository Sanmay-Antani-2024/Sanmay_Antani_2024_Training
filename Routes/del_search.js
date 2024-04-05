const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/del_search_Controller.js");
router.use("/delSearch",auth,routes.delSearchController)
module.exports=router