const express=require("express");
const router=express.Router();
const routes=require("../Controllers/loginControllers.js");
router.get("/login",routes.showlogin);
router.post("/login",routes.dologin);
module.exports= router;