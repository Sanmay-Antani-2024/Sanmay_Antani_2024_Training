const express=require("express");
const router=express.Router();
const routes=require("../Controllers/kookoocube.js")
const auth=require("../authorization_check/authorization.js")
router.get("/kookoo",auth,routes.displaykookoo);
module.exports=router