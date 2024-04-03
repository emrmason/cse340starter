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

// Build add-part view
partsCont.buildAddPartView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./parts/add-part", {
      title: "Add Part",
      nav,
      errors: null,
    });
  } catch (error) {
    res.send("Couldn't build add-part view - ", error);
  }
};

// Add part to database
partsCont.addPart = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price,
  } = req.body;
  const addPartResult = await partsModel.addPart(
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price
  );
  if (addPartResult) {
    const partName = addPartResult.part_name;
    req.flash("message success", `Your part ${partName} was added.`);
    res.redirect("./parts/add-part");
  } else {
    req.flash("message warning", "Sorry, the part coudl not be added.");
    res.status(501).render("./parts/add-part", {
      title: "Add Part",
      nav,
      errors: null,
    });
  }
};

// Get just the parts data
partsCont.getPartsData = async function (req, res, next) {
  try {
    const data = await partsModel.getParts();
    res.json(data);
  } catch (error) {
    console.error(
      "Problem fetching parts data (from parts controller) - ",
      error
    );
  }
};

// Update parts

module.exports = partsCont;
