const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// Build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    // res.render("./inventory/classification", {
    //   title: className + " vehicles",
    //   nav,
    //   grid,
    // });
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    res.send("Can't build, sorry!", error);
  }
};

// Build Inventory Detail page

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  try {
    const data = await invModel.getInventoryDetail(inventory_id);
    // console.log(data);
    const page = await utilities.buildInventoryDetailPage(data);
    let nav = await utilities.getNav();
    const invMake = data[0].inv_make;
    const inventoryModel = data[0].inv_model;
    const invYear = data[0].inv_year;
    res.render("./inventory/detail", {
      title: invYear + " " + invMake + " " + inventoryModel,
      nav,
      page,
    });
  } catch (error) {
    res.send("Couldn't build details page - ", error);
  }
};

// Build Management view

invCont.buildMgmtView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } catch (error) {
    res.send("Couldn't build Management page - ", error);
  }
};

// Build Add-classification view
invCont.buildAddClass = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    res.send("Couldn't build the view - ", error);
  }
};

// Add classification to database
invCont.addClass = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  console.log(classification_name, "This is from invCont.addClass");
  const addClassResult = await invModel.addClass(classification_name);
  if (addClassResult) {
    nav = await utilities.getNav();
    req.flash("message success", "Classification added");
    res.redirect("/inv");
  } else {
    req.flash(
      "message warning",
      "Sorry, something went wrong. Please try again."
    );
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

// Build Add-inventory View
invCont.buildAddInv = async function (req, res, next) {
  let options = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  try {
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null,
    });
  } catch (error) {
    res.send("Couldn't build the view - ", error);
  }
};

// Add Inventory

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
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
  // console.log(req.body, "This is from my invController");
  const invResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (invResult) {
    const itemName = invResult.inv_make + " " + invResult.inv_model;
    req.flash("message success", `Vehicle ${itemName} was added to inventory.`);
    res.redirect("/inv/add-inventory");
  } else {
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("message warning", "Sorry, the vehicle could not be added.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect: classificationSelect,
      errors: null,
    });
  }
};

module.exports = invCont;
