const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const partsController = require("../controllers/partsController");

router.get("/", utilities.handleErrors(partsController.buildPartsView));

router.get(
  "/detail/:part_id",
  utilities.handleErrors(partsController.buildPartsDetail)
);

module.exports = router;
