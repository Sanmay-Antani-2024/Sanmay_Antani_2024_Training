const express=require("express");
const router=express.Router();
const routes=require("../Controllers/logout_controller.js");
router.get("/logout",routes.logout);
module.exports= router;