const express=require("express");
const router=express.Router();
const routes=require("../Controllers/tictactoeControllers.js")
const auth=require("../authorization_check/authorization.js")
router.use(express.static('images'));
router.get("/tictactoe",auth,routes.displaytictactoe);
module.exports=router