const partsModel = require("../models/parts-model");
const utilities = require("../utilities/");

const partsCont = {};

// Build Parts view
partsCont.buildPartsView = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    const partspage = await utilities.buildPartsGrid();
    res.render("./parts/parts", {
      title: "Parts",
      nav,
      errors: null,
      partspage,
    });
  } catch (error) {
    res.send("Couldn't build parts page - ", error);
  }
};

// Build parts detail view
partsCont.buildPartsDetail = async function (req, res, next) {
  const part_id = req.params.part_id;
  try {
    const data = await partsModel.getPartDetail(part_id);
    // console.log("partsCont.buildPartsDetail - ", data[0]);
    const partDetail = await utilities.buildPartDetailPage(data);
    let nav = await utilities.getNav();
    const partName = data[0].part_name;
    res.render("./parts/detail", {
      title: partName,
      nav,
      errors: null,
      partDetail,
    });
  } catch (error) {
    res.send("Couldn't build page - ", error);
  }
};

module.exports = partsCont;
