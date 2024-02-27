const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

router.get("/", errorController.buildErrorPg);
router.get("/myError", errorController.buildMyErrorPg);

module.exports = router;
