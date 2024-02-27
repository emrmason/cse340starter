const utilities = require("../utilities/");
const errorController = {};

errorController.buildErrorPg = async function (req, res, next) {
  const nav = await utilities.getNav();
  if (req.error) {
    let msg = req.error.message;
    res.render("/error", { title: "Error", nav, message });
  }
};

errorController.buildMyErrorPg = async function (req, res, next) {
  const nav = await utilities.getNav();
  if (req.originalUrl === "/myError") {
    let msg = "This is my error, I've built it on purpose.";
    res.render("/myError", { title: "MY Error", nav, msg });
  }
};

module.exports = errorController;
