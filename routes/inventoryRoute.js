const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
//GET Routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
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
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));
router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(invController.buildEditInventory)
);
//POST Routes
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClass)
);
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);
router.post(
  "/update/",
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
