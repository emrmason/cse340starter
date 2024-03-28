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

partsModel.getPartDetail = async function (part_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.parts AS p WHERE p.part_id = $1`,
      [part_id]
    );
    // console.log("parts-model data return - ", data.rows[0]);
    return data.rows;
  } catch (error) {
    console.error("Parts data error " + error);
  }
};
module.exports = partsModel;
