const utilities = require("../utilities/");

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
  });
};

// // Password Show/hide
// const passButton = document.querySelector(".show-pass-btn");
// passButton.addEventListener("click", function () {
//   const passInput = document.getElementById("account_password");
//   const type = passInput.getAttribute("type");
//   if (type === "password") {
//     passInput.setAttribute("type", "text");
//     passButton.innerHTML = "Hide Password";
//   } else {
//     passInput.setAttribute("type", "password");
//     passButton.innerHTML = "Show Password";
//   }
// });

module.exports = accountCont;
