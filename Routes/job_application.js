const express=require("express");
const router=express.Router();
const auth=require("../authorization_check/authorization.js")
const routes=require("../Controllers/job_application_controller.js");
router.use("/jaf",auth,routes.jaf)
router.use("/i",auth,routes.i_get)
router.post("/insert/basic",auth,routes.insert_basic_post)
router.use("/display/basic",auth,routes.display_basic_post)
router.use("/update/basic",auth,routes.update_basic)

router.post("/insert/edu",auth,routes.insert_edu_post)
router.use("/display/edu",auth,routes.display_edu_post)
router.use("/update/edu",auth,routes.update_edu_post)

router.use("/insert/Wexp",auth,routes.insert_Wexp_post)
router.use("/display/Wexp",auth,routes.display_Wexp_post)
router.use("/update/Wexp",auth,routes.update_Wexp_post)

router.use("/insert/langKnown",auth,routes.insert_langKnown_post)
router.use("/display/langKnown",auth,routes.display_langKnown_post)
router.use("/update/langKnown",auth,routes.update_langKnown_post)

router.use("/insert/techKnown",auth,routes.insert_techKnown_post)
router.use("/display/techKnown",auth,routes.display_techKnown_post)
router.use("/update/techKnown",auth,routes.update_techKnown_post)

router.use("/insert/ref",auth,routes.insert_ref_post)
router.use("/display/ref",auth,routes.display_ref_post)
router.use("/update/ref",auth,routes.update_ref_post)

router.use("/insert/pref",auth,routes.insert_pref_post)
router.use("/display/pref",auth,routes.display_pref_post)
router.use("/update/pref",auth,routes.update_pref_post)
router.use("/insert",auth,routes.insert_get)

module.exports=router