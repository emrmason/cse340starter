const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

//Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Register View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);
// Register POST
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
