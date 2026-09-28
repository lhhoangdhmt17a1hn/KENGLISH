function dangXuat(req, res) {
    return res.json({
        thanh_cong: true,
        thong_bao: "Đăng xuất thành công"
    });
}

module.exports = dangXuat;