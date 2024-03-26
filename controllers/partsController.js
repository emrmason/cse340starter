const partsModel = require("../models/parts-model");
const utilities = require("../utilities/");

const partsCont = {};

// Build Parts view
partsCont.buildPartsView = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    const partspage = await utilities.buildPartsGrid();
    res.render("./parts", {
      title: "Parts",
      nav,
      partspage,
    });
  } catch (error) {
    res.send("Couldn't build parts page - ", error);
  }
};
