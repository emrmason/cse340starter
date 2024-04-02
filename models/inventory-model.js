const pool = require("../database/index");
// console.log("Current working directory:", process.cwd());
// console.log("__dirname:", __dirname);

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

// Get all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassifciationsbyid error " + error);
  }
}

// Get all Inventory data
async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id");
}

// Get single inventory data by Id
async function getInventoryDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT *
       FROM public.inventory AS i 
       WHERE i.inv_id = $1`,
      [inv_id]
    );
    // console.log("Inventory Detail Data: ", data.rows[0]);
    return data.rows;
  } catch (error) {
    console.error("Inventory Data error " + error);
  }
}

// Add a new classification

async function addClass(classification_name) {
  console.log([classification_name], "This is from my inventory-model BEFORE");
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    // console.log([classification_name], "This is from my inventory-model AFTER");
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

// Check for existing classification

async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const className = await pool.query(sql, [classification_name]);
    return className.rowCount;
  } catch (error) {
    return error.message;
  }
}

// Add Inventory

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    // console.log(
    //   inv_make,
    //   inv_model,
    //   inv_year,
    //   inv_description,
    //   inv_image,
    //   inv_thumbnail,
    //   inv_price,
    //   inv_miles,
    //   inv_color,
    //   classification_id
    // );
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]);
  } catch (error) {
    return error.message;
  }
}

// Update Inventory function
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("Inventory Update model error: " + error);
  }
}

// Delete inventory function
async function deleteInventory(inventory_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inventory_id]);
    return data;
  } catch (error) {
    new Error("Delete Inventory Error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventory,
  getInventoryDetail,
  addClass,
  addInventory,
  checkExistingClassification,
  updateInventory,
  deleteInventory,
};
