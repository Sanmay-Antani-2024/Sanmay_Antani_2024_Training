const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/chessOfEventsController.js");
router.use("/ET",auth,routes.displayCOE)
module.exports=router