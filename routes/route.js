const express = require("express");
const router = express.Router();
const { checkIp } = require("../controllers/task");

router.route("/checkIp").post(checkIp);

module.exports = router;
