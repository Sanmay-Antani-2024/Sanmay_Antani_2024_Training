const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/dynamic_table_controller.js");
router.use("/DT",auth,routes.displayDynamicTable)
module.exports=router