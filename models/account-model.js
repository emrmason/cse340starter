const pool = require("../database/index");

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

acctModel.checkExistingEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
};

// acctModel.checkLoginEmail = async function (account_email) {
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1";
//     const result = await pool.query(sql, [account_email]);
//     return result.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// };

module.exports = acctModel;
