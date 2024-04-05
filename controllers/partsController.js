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
    req.flash("message success", `Your part ${part_name} was added.`);
    res.redirect("/inv");
  } else {
    req.flash("message warning", "Sorry, the part coudl not be added.");
    res.status(501).render("parts/add-part", {
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

// Build update parts view
partsCont.buildUpdateParts = async function (req, res, next) {
  const part_id = req.params.part_id;
  let nav = await utilities.getNav();
  const partData = await partsModel.getPartDetail(part_id);
  const partName = `${partData[0].part_name}`;
  try {
    res.render("./parts/update-part", {
      title: "Update " + partName,
      nav,
      errors: null,
      part_id: partData[0].part_id,
      part_name: partData[0].part_name,
      part_description: partData[0].part_description,
      part_image: partData[0].part_image,
      part_thumbnail: partData[0].part_thumbnail,
      part_price: partData[0].part_price,
    });
  } catch (error) {
    res.send("Error building parts update view - ", error);
  }
};

// Process update to part
partsCont.updatePart = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    part_id,
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price,
  } = req.body;
  console.log(req.body);
  const updateResult = await partsModel.updatePart(
    part_id,
    part_name,
    part_description,
    part_image,
    part_thumbnail,
    part_price
  );
  if (updateResult) {
    itemName = updateResult.part_name;
    req.flash("message success", `${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const itemName = part_name;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("parts/update-part", {
      title: "Update " + itemName,
      nav,
      errors: null,
      part_id,
      part_name,
      part_description,
      part_image,
      part_thumbnail,
      part_price,
    });
  }
};

// Build Delete Parts view
partsCont.buildDeletePart = async function (req, res, next) {
  const part_id = req.params.part_id;
  let nav = await utilities.getNav();
  const itemData = await partsModel.getPartDetail(part_id);
  const itemName = `${itemData[0].part_name}`;
  try {
    res.render("./parts/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      part_id: itemData[0].part_id,
      part_name: itemData[0].part_name,
      part_description: itemData[0].part_description,
      part_price: itemData[0].part_price,
    });
  } catch (error) {
    res.send("Couldn't build the view - ", error);
  }
};

// Process delete part
partsCont.deletePart = async function (req, res, next) {
  let nav = await utilities.getNav();
  // const part_id = req.body.part_id;
  // const itemName = req.body.part_name;
  // console.log(part_id);
  const { part_id, part_name, part_description, part_price } = req.body;
  const deleteResult = await partsModel.deletePart(
    part_id,
    part_name,
    part_description,
    part_price
  );
  if (deleteResult) {
    req.flash("message success", `${part_name} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry the deletion failed.");
    res.status(501).render("parts/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      part_id,
      part_name,
      part_description,
      part_price,
    });
  }
};

module.exports = partsCont;
