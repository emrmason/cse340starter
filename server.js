/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const myErrorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");

/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));

//Inventory Routes
app.use("/inv", inventoryRoute);

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

//My error handler
app.use("/", myErrorRoute);

app.use(async (req, res, next) => {
  let nav = await utilities.getNav();
  res.handleMyError = (error) => {
    next(error);
  };
  next();
});

//Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status === 500 || req.originalUrl === "/myError") {
    res.render("errors/myError"),
      {
        title: "My Error",
        message: "I did this on purpose",
        nav,
      };
  } else {
    res.render("errors/error"),
      {
        title: err.status || "Server Error",
        message: err.message,
        nav,
      };
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
