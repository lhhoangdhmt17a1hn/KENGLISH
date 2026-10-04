const ketNoi = require("../../config/database");

async function xacThucEmail(req, res) {
    try {
        // Lấy dữ liệu Android gửi lên
        const {
            email = "",
            ma_xac_thuc = ""
        } = req.body;

        const emailNguoiDung = email.trim();

        // Kiểm tra dữ liệu
        if (!emailNguoiDung || !ma_xac_thuc) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Vui lòng nhập mã OTP đã được gửi tới email của bạn"
            });
        }

        // Tìm người dùng theo email
        const [ketQua] = await ketNoi.execute(
            `SELECT
                id,
                email_da_xac_thuc,
                ma_xac_thuc,
                het_han_ma_xac_thuc
             FROM nguoi_dung
             WHERE email = ?`,
            [emailNguoiDung]
        );

        // Không tìm thấy tài khoản
        if (ketQua.length === 0) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Tài khoản không tìm thấy"
            });
        }

        const nguoiDung = ketQua[0];

        // Email đã được xác thực
        if (nguoiDung.email_da_xac_thuc === 1) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Email đã được xác thực"
            });
        }

        // Kiểm tra OTP
        if (String(ma_xac_thuc) !== String(nguoiDung.ma_xac_thuc)) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Mã OTP không đúng"
            });
        }

        // Kiểm tra OTP hết hạn
        const thoiGianHetHan = new Date(
            nguoiDung.het_han_ma_xac_thuc
        );

        if (new Date() > thoiGianHetHan) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Mã OTP đã hết hạn"
            });
        }

        // Xác thực email và xóa OTP đã sử dụng
        await ketNoi.execute(
            `UPDATE nguoi_dung
             SET email_da_xac_thuc = 1,
                 ma_xac_thuc = NULL,
                 het_han_ma_xac_thuc = NULL,
                 da_xoa = 0,
                 xoa_luc = NULL
             WHERE id = ?`,
            [nguoiDung.id]
        );

        return res.json({
            thanh_cong: true,
            thong_bao: "Email xác thực thành công"
        });

    } catch (error) {
        console.error("Lỗi xác thực email:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Email xác thực thất bại"
        });
    }
}

module.exports = xacThucEmail;