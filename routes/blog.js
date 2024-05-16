const adminController = require("../controllers/blogadminController");
const newsletterController  = require("../controllers/newsletterController");
const { uploadS3 } = require('../helpers/multers3');

const express = require("express")
const router = express.Router()

router.route("/admin/create-account").post(adminController.createAdmin)
router.route("/admin/login").post(adminController.adminLogin)
router.route("/admin/create-blogpost").post(uploadS3.fields([{name : 'coverPicture', maxCount: 1}, {name : 'authorPicture', maxCount : 1}]),adminController.createBlogPost)
router.route("/admin/save-draft").post(uploadS3.fields([{name : 'coverPicture', maxCount: 1}, {name : 'authorPicture', maxCount : 1}]),adminController.saveDraft)
router.route("/admin/edit-blogpost").put(uploadS3.fields([{name : 'coverPicture', maxCount: 1}, {name : 'authorPicture', maxCount : 1}]), adminController.editBlogPost)
router.route("/admin/delete-blogpost/:title").delete(adminController.DeleteBlogPost)
router.route("/get-blogposts").get(adminController.getAllBlogPost)
router.route("/admin/get-draft").get(adminController.getDraft)
router.route("/get-blogpost/:title").get(adminController.getSingleBlogPost)
router.route("/newsletter/remove/:id").delete(newsletterController.removeNewsletter)
router.route("/newsletter/add-recipient").post(newsletterController.addRecipient)
router.route("/newsletter/getall-recipients").get(newsletterController.getAllRecipients)
router.route("/newsletter/remove-recipient/:email").delete(newsletterController.removeRecipient)
router.route("/newsletter/send").post(uploadS3.fields([{name : 'events', maxCount: 1}]), newsletterController.SendNewsletter)
router.route("/newsletter/send-sample").post(uploadS3.fields([{name : 'events', maxCount: 1}]), newsletterController.SendSampleNewsletter)
router.route("/newsletter/getall").get(newsletterController.getAllNewsletter)
module.exports = router
