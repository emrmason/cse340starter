const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

//Login View
router.get("/login", accountController.buildLogin);

module.exports = router;
