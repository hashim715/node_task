const pool = require("../config/db");

const checkIp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(401)
        .json({ success: false, message: "Please provide valid input" });
    }
    let ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    let data = await pool.query("SELECT * FROM ip_table WHERE ip_address=$1", [
      ip_address,
    ]);
    let count = 1;
    if (data.rows.length > 0) {
      count = data.rows[0].count;
      if (count >= 2) {
        res.status(401).json({
          success: false,
          message: "You have already requested 2 times",
        });
      } else {
        count = count + 1;
        await pool.query(`UPDATE ip_table SET count=$1 WHERE (ip_address=$2)`, [
          count,
          ip_address,
        ]);
        res.status(200).json({
          success: true,
          message: "Your ip has been added twice now",
        });
      }
    } else {
      data = await pool.query(
        "INSERT INTO ip_table (ip_address,count) VALUES($1,$2)",
        [ip_address, count]
      );
      res.status(200).json({
        success: true,
        message: "Your ip has been added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

module.exports = { checkIp };
