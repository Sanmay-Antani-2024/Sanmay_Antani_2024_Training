const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/api_with_pages_controller.js");
router.use("/api",auth,routes.api)
module.exports=router