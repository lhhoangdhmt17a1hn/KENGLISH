const express = require("express");
const { dangKy, xacThucEmail } = require("../controllers/authController");

const router = express.Router();

// POST /auth/dang-ky
router.post("/dang-ky", dangKy);
// POST /auth/xac-thuc-email
router.post("/xac-thuc-email", xacThucEmail);

module.exports = router;