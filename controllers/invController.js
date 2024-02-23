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

module.exports = invCont;
