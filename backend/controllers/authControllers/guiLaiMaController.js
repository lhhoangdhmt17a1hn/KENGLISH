const crypto = require("crypto");

const ketNoi = require("../../config/database");
const { guiMaXacThuc } = require("../../services/emailService");

async function guiLaiMaXacThuc(req, res) {
    try {
        // Lấy email Android gửi lên
        const { email = "" } = req.body;

        const emailNguoiDung = email.trim();

        // Kiểm tra email
        if (!emailNguoiDung) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Vui lòng nhập email của bạn"
            });
        }

        // Tìm người dùng theo email
        const [ketQua] = await ketNoi.execute(
            `SELECT id, email_da_xac_thuc
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

        // Tạo OTP mới gồm 6 chữ số
        const maXacThuc = crypto.randomInt(
            100000,
            1000000
        );

        // OTP mới hết hạn sau 5 phút
        const hetHanMaXacThuc = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Cập nhật OTP mới vào database
        await ketNoi.execute(
            `UPDATE nguoi_dung
             SET ma_xac_thuc = ?,
                 het_han_ma_xac_thuc = ?
             WHERE id = ?`,
            [
                maXacThuc,
                hetHanMaXacThuc,
                nguoiDung.id
            ]
        );

        // Gửi OTP mới tới email
        const guiEmailThanhCong = await guiMaXacThuc(
            emailNguoiDung,
            maXacThuc
        );

        if (guiEmailThanhCong) {
            return res.json({
                thanh_cong: true,
                thong_bao: "Mã OTP đã được gửi tới email của bạn"
            });
        }

        return res.json({
            thanh_cong: false,
            thong_bao: "Gửi mã OTP tới email của bạn thất bại"
        });

    } catch (error) {
        console.error("Lỗi gửi lại mã xác thực:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Gửi lại mã OTP thất bại"
        });
    }
}

module.exports = guiLaiMaXacThuc;