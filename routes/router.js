const { Router } = require('express');
const router = Router();
const checkAuth = require("../middleware/middleware");

const { signIn_get, signup_get, signup_post, login_post, getHomePage, getTestPage } = require("../controller/controllers");

router.route("/").get(signIn_get);
router.route("/signup").get(signup_get);
router.route("/signup").post(signup_post);
router.route("/login").post(login_post);
router.route("/home").get(checkAuth, getHomePage);
router.route("/test").get(checkAuth, getTestPage);

module.exports = router;