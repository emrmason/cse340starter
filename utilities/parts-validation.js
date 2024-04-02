const utilities = require(".");
const { body, validationResult } = require("express-validator");
const partsModel = require("../models/parts-model");
const partsValidate = {};

// Validate add Parts rules
partsValidate.addPartsRules = () => {
  return [
    body("part_name")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide the name of the part."),

    body("part_description")
      .trim()
      .escape()
      .isLength({ min: 10 })
      .withMessage("Please provide a description of the part."),

    body("part_image")
      .trim()
      .isLength({ min: 6 })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Check filepath. If you have no image, use this default: /images/parts/no-image.png "
      ),

    body("part_thumbnail")
      .trim()
      .isLength({ min: 6 })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Check filepath. If you have no image, use this default: /images/parts/no-image-tn.png "
      ),

    body("part_price")
      .trim()
      .isDecimal()
      .withMessage("Please provide a price."),
  ];
};

// Validate Add Parts Data

partsValidate.checkPartsData = async (req, res, next) => {
  const {
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./parts/add-part", {
      errors,
      title: "Add Inventory",
      nav,
      part_name,
      part_description,
      part_image,
      part_thumbnail,
      part_price,
    });
    return;
  }
  next();
};

// Validate UPDATE Parts Data
partsValidate.checkUpdateData = async (req, res, next) => {
  const {
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./parts/add-part", {
      errors,
      title: "Edit " + part_name,
      nav,
      part_name,
      part_description,
      part_image,
      part_thumbnail,
      part_price,
    });
    return;
  }
  next();
};

module.exports = partsValidate;
