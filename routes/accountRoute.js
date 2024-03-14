const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

//Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Register View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);
// Account Management view
router.get("/", utilities.handleErrors(accountController.buildMgmt));

// Register POST
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login POST
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
