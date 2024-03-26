const pool = require("../database/index");
const partsModel = {};

partsModel.getParts = async function () {
  try {
    const data = await pool.query(
      "SELECT * FROM public.parts ORDER BY part_id"
    );
    // console.log("From parts-model - ", data.rows);
    return data.rows;
  } catch (error) {
    console.error("getParts error " + error);
  }
};

module.exports = partsModel;
