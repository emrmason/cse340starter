const invModel = require("../models/inventory-model");
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

// Build Inventory Management page HTML

// Error Handling
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
