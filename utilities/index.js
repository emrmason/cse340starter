const invModel = require("../models/inventory-model");
const partsModel = require("../models/parts-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href = "/" title = "Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list +=
    '<li><a href="/parts" title="See what parts we offer for purchase">Parts</a></li>';
  list += "</ul>";
  return list;
};

//Build the classification view HTML

Util.buildClassificationGrid = async function (data) {
  // let data = await invModel.getInventoryByClassificationId();
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '"title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /> </a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Build Inventory Detail page HTML
Util.buildInventoryDetailPage = async function (data) {
  // let info = await invModel.getInventoryDetail();
  let page = "";
  if (data.length > 0) {
    const row = data[0];
    const price = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(row.inv_price);
    const miles = row.inv_miles.toLocaleString("en-US");

    page +=
      "<title>" +
      row.inv_year +
      " " +
      row.inv_make +
      " " +
      row.inv_model +
      "</title>";
    page += "<section id='vehicle-detail'>";
    page +=
      "<div id='details-img' class='main-image'> <img src='" +
      row.inv_image +
      "' alt='" +
      row.inv_year +
      " " +
      row.inv_make +
      " " +
      row.inv_model +
      "' /> </div>";
    page += "<div id='details-list' class='details'>";
    page += "<h2>" + row.inv_make + " " + row.inv_model + " Details: </h2>";
    page += "<ul class= 'vehicle-stats'>";
    page += "<li> <b>Price: " + price + "</b></li>";
    page += "<li> <b>Description: </b>" + row.inv_description + "</li>";
    page += "<li> <b>Color: </b>" + row.inv_color + "</li>";
    page += "<li> <b>Miles: </b>" + miles + "</li>";
    page += "</ul> </div> </section>";
  } else {
    page += '<p class="notice">Sorry, we could not find the detail page. </p>';
  }
  return page;
};

// Build Classification List for Add Inventory
Util.buildClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let options =
    "<select class='dropdown-1' id='classificationList' name='classification_id'><option>Select One</option>";
  data.rows.forEach((row) => {
    options +=
      "<option value='" +
      row.classification_id +
      "' name = '" +
      row.classification_id +
      "'>" +
      row.classification_name +
      "</option>";
  });
  options += "</select>";
  return options;
};

// Middleware to check token validity
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("./account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

// Use for Employees/Admin
Util.checkEmployeeAuth = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.");
    return res.redirect("./account/login");
  }
  if (res.locals.loggedin) {
    const accountData = res.locals.accountData;
    if (
      accountData.account_type === "Employee" ||
      accountData.account_type === "Admin"
    ) {
      next();
    } else {
      req.flash("notice", "You're not authorized to view this content.");
      res.redirect("./account/login");
    }
  }
};

// Build Parts Page
Util.buildPartsGrid = async function (req, res, next) {
  try {
    let data = await partsModel.getParts();
    // console.log("From Util.buildPartsGrid ", data);
    let partspage = "";
    if (data.length > 0) {
      partspage += '<ul id="parts-display">';
      data.forEach((part) => {
        partspage +=
          '<li> <a href="../parts/detail/' +
          part.part_id +
          '" title= "View ' +
          part.part_name +
          'details">' +
          '<img src="' +
          part.part_thumbnail +
          '" alt = "Image of ' +
          part.part_name +
          ' on CSE Motors"> </a>';
        partspage += '<div class="parts-price"> <hr />';
        partspage +=
          '<h2><a href="../parts/detail/' +
          part.part_id +
          '" title= "View ' +
          part.part_name +
          'details">' +
          part.part_name +
          "</a></h2>";
        partspage +=
          "<span>$" +
          new Intl.NumberFormat("en-US").format(part.part_price) +
          "</span>";
        partspage += "</div>";
        partspage += "</li>";
      });
      partspage += "</ul>";
    } else {
      partspage += '<p class="notice">Sorry, no parts could be found.</p>';
    }
    return partspage;
  } catch (error) {
    console.error("Error in buildPartsGrid: ", error);
    throw error;
  }
};

// Error Handling
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
