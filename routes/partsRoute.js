const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const partsController = require("../controllers/partsController");
const partsValidate = require("../utilities/parts-validation");

router.get("/", utilities.handleErrors(partsController.buildPartsView));

router.get("/api/parts", utilities.handleErrors(partsController.getPartsData));

router.get(
  "/detail/:part_id",
  utilities.handleErrors(partsController.buildPartsDetail)
);

router.get(
  "/add-part",
  utilities.handleErrors(partsController.buildAddPartView)
);

router.post(
  "/add-part",
  partsValidate.addPartsRules(),
  partsValidate.checkPartsData,
  utilities.handleErrors(partsController.addPart)
);

router.post(
  "/update/:part_id"
  // invValidate.addInventoryRules(),
  // invValidate.checkUpdateData,
  // utilities.handleErrors(invController.updateInventory)
);
// router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
