const pool = require("../database/index");
const partsModel = {};

// Get all parts
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

// Get part detail
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

// Add a new Part
partsModel.addPart = async function (
  part_name,
  part_description,
  part_image,
  part_thumbnail,
  part_price
) {
  try {
    const sql =
      "INSERT INTO parts (part_name, part_description, part_image, part_thumbnail, part_price) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    return await pool.query(sql, [
      part_name,
      part_description,
      part_image,
      part_thumbnail,
      part_price,
    ]);
  } catch (error) {
    console.log("Parts Model Error - ", error);
  }
};
module.exports = partsModel;
