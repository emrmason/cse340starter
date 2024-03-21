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
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
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
    res.redirect("./inv/add-inventory");
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

// Get Inventory JSON by Classification
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId);
  console.log(classification_id, "This is from invController.getInventoryJSON");
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned."));
  }
};

//Build Edit Inventory by Id view
invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  let options = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDetail(inventory_id);
  // console.log(itemData[0].inv_make, "This is from invCont.buildEditInventory");
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  try {
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      options: options,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
    });
  } catch (error) {
    res.send("Couldn't build the view - ", error);
  }
};

// Process inventory updates

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};

// Build Delete inventory view
invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDetail(inventory_id);
  console.log(
    itemData[0].inv_make,
    "This is from invCont.buildDeleteInventory"
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  try {
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
    });
  } catch (error) {
    res.send("Couldn't build the view - ", error);
  }
};

// Process Delete inventory
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventory_id = req.body.inv_id;
  const itemName = req.body.inv_make + " " + req.body.inv_model;
  console.log(inventory_id);
  const { inv_id, inv_make, inv_model, inv_price, inv_year } = req.body;
  const deleteResult = await invModel.deleteInventory(inventory_id);
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the deletion failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont;
