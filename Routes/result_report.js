const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/result_report.js");
router.use("/result",auth,routes.result)
router.use("/reportCard",auth,routes.reportCard)
module.exports=router