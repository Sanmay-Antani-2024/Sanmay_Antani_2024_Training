const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/homepageControllers.js");
router.use("/homePage",auth,routes.homePageDisplay)
module.exports=router