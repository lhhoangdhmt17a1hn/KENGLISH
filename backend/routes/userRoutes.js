const express = require("express");

const xacThucToken = require("../middleware/xacThucToken");
const xoaTaiKhoan = require(
    "../controllers/userControllers/xoaTaiKhoanController"
);

const router = express.Router();

router.delete(
    "/me",
    xacThucToken,
    xoaTaiKhoan
);

module.exports = router;