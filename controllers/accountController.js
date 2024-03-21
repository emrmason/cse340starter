const utilities = require("../utilities/");
const acctModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountCont = {};

//Build Login view
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
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

//Build Account Management view
accountCont.buildMgmt = async function (req, res, next) {
  let nav = await utilities.getNav();
  let name = res.locals.accountData.account_firstname;
  let accountType = res.locals.accountData.account_type;
  let account_id = res.locals.accountData.account_id;
  let content = "";
  content += `<h2>Welcome ${name}!</h2>`;
  content += `<a href="./update/${account_id}" title="Click to update your account">Update account information</a>`;
  if (accountType === "Client") {
    res.render("./account/", {
      title: "Account Management",
      nav,
      errors: null,
      content,
    });
  } else {
    content += "<br> <br> <h3>Inventory Management</h3>";
    content += "<p><a href='/inv/'>Click to access Inventory Management</a><p>"; // I need help with this href, it's trying to go to /account/inv...
    res.render("./account/", {
      title: "Account Management",
      nav,
      errors: null,
      content,
    });
  }
  return account_id;
};

// Build Account Update view with data populated
accountCont.buildUpdate = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = req.params.accountId;
  const accountData = await acctModel.getAccountById(account_id);
  try {
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData[0].account_firstname,
      account_lastname: accountData[0].account_lastname,
      account_email: accountData[0].account_email,
    });
  } catch (error) {
    res.send(error);
  }
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
  res.status(500).render("./account/register", {
    title: "Registration",
    nav,
    errors: null,
  });
};

// Process Login

accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await acctModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  } else {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("./");
    }
  }
};

module.exports = accountCont;
