const express=require("express");
const router=express.Router();
// const {getReg,insertPass,submitRegistration}=require("../Controllers/RegistrationControllers.js");
const test=require("../Controllers/RegistrationControllers.js");

console.log(test);

router.get("/",test.getReg);
router.post("/insert/Pass",test.insertPass);
router.post("/",test.submitRegistration);
router.get("/:code",test.routedisplayPasswordPage);
module.exports= router;
    