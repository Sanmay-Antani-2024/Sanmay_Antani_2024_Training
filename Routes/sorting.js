const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/sortingController.js");
router.use("/sorting",auth,routes.sorting)
module.exports=router