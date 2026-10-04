const ketNoi = require("../../config/database");

async function xoaTaiKhoan(req, res) {
    try {
        // ID lấy từ JWT đã được middleware xác thực
        const nguoiDungId = req.nguoiDung.id;

        const [ketQua] = await ketNoi.execute(
            `UPDATE nguoi_dung
             SET da_xoa = 1,
                 xoa_luc = NOW(),
                 email_da_xac_thuc = 0
             WHERE id = ? AND da_xoa = 0`,
            [nguoiDungId]
        );

        if (ketQua.affectedRows === 0) { // số dòng được tác động bởi SQL
            return res.status(404).json({
                thanh_cong: false,
                thong_bao: "Tài khoản không tồn tại hoặc đã được xóa"
            });
        }

        return res.json({
            thanh_cong: true,
            thong_bao: "Xóa tài khoản thành công"
        });

    } catch (error) {
        console.error("Lỗi xóa tài khoản:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Lỗi server"
        });
    }
}

module.exports = xoaTaiKhoan;