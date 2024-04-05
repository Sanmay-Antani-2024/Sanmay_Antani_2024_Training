const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/searching_filter_controller.js");
router.use("/filter",auth,routes.filter)
module.exports=router