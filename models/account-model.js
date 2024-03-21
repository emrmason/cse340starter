const pool = require("../database/index");
const jwt = require("jsonwebtoken");
const acctModel = {};

// Register a new account
acctModel.registerAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
};

// Check if the email is already in the database

acctModel.checkExistingEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    console.log(email.rowCount, "This is from acctModel.checkExistingEmail");
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
};

// Return account data using email address
acctModel.getAccountByEmail = async function (account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    // console.log(result.rows[0], "this is from acctModel.getAccountByEmail");
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
};

// Get account by Id
acctModel.getAccountById = async function (account_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.account AS a WHERE a.account_id = $1",
      [account_id]
    );
    console.log("Account Data: ", data);
    return data.rows;
  } catch (error) {
    console.error("Account Data error " + error);
  }
};

module.exports = acctModel;
