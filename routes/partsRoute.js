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

router.get(
  "/update/:part_id",
  utilities.checkEmployeeAuth,
  utilities.handleErrors(partsController.buildUpdateParts)
);
router.get(
  "/delete/:part_id",
  utilities.checkEmployeeAuth,
  utilities.handleErrors(partsController.buildDeletePart)
);

router.post(
  "/add-part",
  partsValidate.addPartsRules(),
  partsValidate.checkPartsData,
  utilities.handleErrors(partsController.addPart)
);

router.post(
  "/update/:part_id",
  utilities.checkEmployeeAuth,
  utilities.handleErrors(partsController.buildUpdateParts)
);

router.post(
  "/delete/",
  utilities.handleErrors(partsController.deleteInventory)
);

module.exports = router;
