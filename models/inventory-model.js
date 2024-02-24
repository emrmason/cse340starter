const pool = require("../database/index");
console.log("Current working directory:", process.cwd());
console.log("__dirname:", __dirname);

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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventory,
  getInventoryDetail,
};
