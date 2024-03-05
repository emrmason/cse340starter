const utilities = require("../utilities/");
const acctModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const accountCont = {};

//Build Login view
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
  });
};

// Build Registration view
accountCont.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

// Process Registration
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
  }
  const regResult = await acctModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/register", {
      title: "Register",
      nav,
    });
  }
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  });
};

module.exports = accountCont;
