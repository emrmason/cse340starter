const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const invValidate = {};

// Validate add category - make sure it's not already there

invValidate.addCategory = () => {
  return [
    body("category_name")
      .trim()
      .withMessage("Please add a category name.")
      .custom(async (category_name) => {
        const categoryExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (categoryExists) {
          console.log("Category already exists, cannot add.");
          throw new Error("Category already exists, cannot add.");
        }
      }),
  ];
};

// Validate add inventory rules
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."),

    body("inv_model")
      .isLength({ min: 1 })
      .withMessage("Please provide the model of the vehicle."),

    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide the year the vehicle was built."),

    body("inv_description")
      .isLength({ min: 10 })
      .withMessage("Please provide a description of the vehicle."),

    // body("inv_image")
    //   .trim()
    //   .withMessage(
    //     "Check filepath. If you have no image, use this default: /images/vehicles/no-image.png "
    //   ),

    // body("inv_thumbnail")
    //   .trim()
    //   .withMessage(
    //     "Check filepath. If you have no image, use this default: /images/vehicles/no-image-tn.png "
    //   ),

    body("inv_price")
      .trim()
      .isLength({ min: 4, max: 9 })
      .withMessage("Please provide a price (numbers only)."),

    body("inv_miles")
      .trim()
      .isLength({ min: 2, max: 9 })
      .withMessage("Please provide the mileage of the vehicle (numbers only."),

    body("inv_color")
      .isLength({ min: 3 })
      .withMessage("Please provide a valid color."),
  ];
};

// Validate Add Inventory Data

invValidate.checkInvData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let options = await invModel.getClassifications();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      options,
    });
    return;
  }
  next();
};

module.exports = invValidate;
