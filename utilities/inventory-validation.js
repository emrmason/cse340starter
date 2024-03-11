const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const invValidate = {};

// Validate add category - make sure it's not already there

invValidate.addCategory = () => {
  return [
    body("category_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please add a category name."),
  ];
};

invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmtpy()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

//attempt at checking if the classification already exists...

//       .custom(async (category_name) => {
//         const categoryExists = await invModel.checkExistingClassification(
//           classification_name
//         );
//         if (categoryExists) {
//           console.log("Category already exists, cannot add.");
//           throw new Error("Category already exists, cannot add.");
//         }
//       }),
//   ];
// };

// Validate add inventory rules
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide the make of the vehicle."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide the model of the vehicle."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please provide the year the vehicle was built."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 10 })
      .withMessage("Please provide a description of the vehicle."),

    body("inv_image")
      .trim()
      .isLength({ min: 6 })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Check filepath. If you have no image, use this default: /images/vehicles/no-image.png "
      ),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 6 })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Check filepath. If you have no image, use this default: /images/vehicles/no-image-tn.png "
      ),

    body("inv_price").trim().isDecimal().withMessage("Please provide a price."),

    body("inv_miles")
      .trim()
      .isInt({ no_symbols: true })
      .withMessage("Please provide the mileage of the vehicle (numbers only."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid color."),

    body("classification_id")
      .trim()
      .isInt({ no_symbols: true })
      .withMessage("The vehicle's classification is required."),
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
  // console.log(errors);
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
