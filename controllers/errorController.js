const utilities = require("../utilities/");
const errorController = {};

errorController.buildErrorPg = async function (req, res, next) {
  const nav = await utilities.getNav();
  if (req.error) {
    let msg = req.error.message;
    res.render("error/error", { title: "Error", nav, msg });
  }
};

errorController.buildMyErrorPg = async function (req, res, next) {
  const nav = await utilities.getNav();
  if (req.originalUrl === "/myError") {
    let msg = "This is my error, I've built it on purpose.";
    res.render("error/myError", { title: "MY Error", nav, msg });
  }
};

module.exports = errorController;
