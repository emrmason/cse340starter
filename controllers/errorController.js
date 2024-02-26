// const utilities = require("../utilities/");
// const errorController = {};

// errorController.buildErrorPg = async function (req, res, next) {
//   const nav = await utilities.getNav();
//   if (req.error) {
//     let msg = req.error.message;
//     (message += "<h1>Error</h1>"), (message += msg);
//     res.render("/error", { title: "Error", nav, message });
//   } else {
//     res.send("Could not render Error page.");
//   }
// };

// errorController.buildMyErrorPg = async function (req, res, next) {
//   const nav = await utilities.getNav();
//   if (req.originalUrl === "/myError") {
//     let msg = "This is my error, I've built it on purpose.";
//     res.render("/myError", { title: "MY Error", nav, msg });
//   }
// };

// module.exports = errorController;
