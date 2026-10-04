const express = require("express");
const router = express.Router();

const { traTu } = require("../controllers/dictionaryControllers/traTuController");
const { goiYTu } = require("../controllers/dictionaryControllers/goiYTuController");
const xacThucToken = require("../middleware/xacThucToken");
const { themLichSuTraTu, layLichSuTraTu, xoaLichSuTraTu } = require("../controllers/dictionaryControllers/lichSuTraTuController");

// Tra từ
router.get("/lookup", traTu);
router.get("/search", goiYTu);
router.post("/history", xacThucToken, themLichSuTraTu);
router.get("/history", xacThucToken, layLichSuTraTu);
router.delete("/history", xacThucToken, xoaLichSuTraTu);

module.exports = router;