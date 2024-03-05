const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId_)
);
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);
router.get("/", utilities.handleErrors(invController.buildMgmtView));
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClass)
);
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClass)
);

module.exports = router;
