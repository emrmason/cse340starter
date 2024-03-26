const pool = require("../database/index");
const partsModel = {};

async function getParts() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.parts ORDER BY part_id"
    );
    return data.rows;
  } catch (error) {
    console.error("getParts error " + error);
  }
}

module.exports = partsModel;
