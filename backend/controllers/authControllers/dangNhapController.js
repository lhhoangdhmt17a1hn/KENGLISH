const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ketNoi = require("../../config/database");

async function dangNhap(req, res) {
    try {
        // Lấy thông tin đăng nhập
        const {
            email = "",
            mat_khau = ""
        } = req.body;

        const emailNguoiDung = email.trim();
        const matKhau = mat_khau;

        // Kiểm tra dữ liệu đầu vào
        if (!emailNguoiDung || !matKhau) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Vui lòng nhập email và mật khẩu"
            });
        }

        // Tìm người dùng theo email
        const [ketQua] = await ketNoi.execute(
            `SELECT
                id,
                ten_hien_thi,
                email,
                mat_khau,
                email_da_xac_thuc
             FROM nguoi_dung
             WHERE email = ?`,
            [emailNguoiDung]
        );

        // Không tìm thấy tài khoản
        if (ketQua.length === 0) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Email hoặc mật khẩu chưa đúng"
            });
        }

        const nguoiDung = ketQua[0];

        // Kiểm tra mật khẩu
        const matKhauDung = await bcrypt.compare(
            matKhau,
            nguoiDung.mat_khau
        );

        if (!matKhauDung) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Email hoặc mật khẩu chưa đúng"
            });
        }

        // Kiểm tra email đã được xác thực chưa
        if (nguoiDung.email_da_xac_thuc === 0) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Vui lòng xác thực email của bạn trước khi đăng nhập"
            });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                id: nguoiDung.id,
                email: nguoiDung.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "30d"
            }
        );

        // Đăng nhập thành công
        return res.json({
            thanh_cong: true,
            thong_bao: "Đăng nhập thành công",

            token: token,

            nguoi_dung: {
                id: nguoiDung.id,
                ten_hien_thi: nguoiDung.ten_hien_thi,
                email: nguoiDung.email
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Đăng nhập thất bại"
        });
    }
}

module.exports = dangNhap;