const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/dynamic_query_controller.js");
router.get("/dqe",auth,routes.dqe_get)
router.post("/dqe",auth,routes.dqe_post)
module.exports=router