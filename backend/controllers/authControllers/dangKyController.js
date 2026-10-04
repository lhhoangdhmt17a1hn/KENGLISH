const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ketNoi = require("../../config/database");
const { guiMaXacThuc } = require("../../services/emailService");

async function dangKy(req, res) {
    try {
        // Lấy dữ liệu Android gửi lên
        const {
            ten_hien_thi = "",
            email = "",
            mat_khau = ""
        } = req.body;

        const tenHienThi = ten_hien_thi.trim();
        const emailNguoiDung = email.trim();
        const matKhau = mat_khau;

        // Kiểm tra dữ liệu
        if (!tenHienThi || !emailNguoiDung || !matKhau) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Vui lòng điền đủ thông tin yêu cầu"
            });
        }

        // Kiểm tra định dạng email
        const emailHopLe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailHopLe.test(emailNguoiDung)) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Email chưa được xác thực"
            });
        }

        // Kiểm tra độ dài mật khẩu
        if (matKhau.length < 6) {
            return res.json({
                thanh_cong: false,
                thong_bao: "Mật khẩu phải chứa ít nhất 6 ký tự"
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const [ketQua] = await ketNoi.execute(
            `SELECT id, da_xoa
             FROM nguoi_dung
             WHERE email = ?`,
            [emailNguoiDung]
        );

        // Nếu email đã tồn tại
        if (ketQua.length > 0) {
            const nguoiDungCu = ketQua[0];

            // Email thuộc tài khoản đang hoạt động
            if (nguoiDungCu.da_xoa === 0) {
                return res.json({
                    thanh_cong: false,
                    thong_bao: "Email đã được sử dụng"
                });
            }

            // Email thuộc tài khoản đã xóa
            if (nguoiDungCu.da_xoa === 1) {

                // Hash mật khẩu mới
                const matKhauHash = await bcrypt.hash(matKhau, 10);

                // Tạo OTP gồm 6 chữ số
                const maXacThuc = crypto.randomInt(100000, 1000000);

                // OTP hết hạn sau 5 phút
                const hetHanMaXacThuc =
                    new Date(Date.now() + 5 * 60 * 1000);

                // Cập nhật lại thông tin tài khoản cũ
                // Chưa đặt da_xoa = 0 vì user chưa xác thực OTP
                await ketNoi.execute(
                    `UPDATE nguoi_dung
                     SET ten_hien_thi = ?,
                         mat_khau = ?,
                         ma_xac_thuc = ?,
                         het_han_ma_xac_thuc = ?
                     WHERE id = ?`,
                    [
                        tenHienThi,
                        matKhauHash,
                        maXacThuc,
                        hetHanMaXacThuc,
                        nguoiDungCu.id
                    ]
                );

                // Gửi mã xác thực đến email
                const guiEmailThanhCong =
                    await guiMaXacThuc(
                        emailNguoiDung,
                        maXacThuc
                    );

                if (guiEmailThanhCong) {
                    return res.json({
                        thanh_cong: true,
                        thong_bao:
                            "Đăng ký thành công. Vui lòng kiểm tra email của bạn."
                    });
                }

                return res.json({
                    thanh_cong: false,
                    thong_bao:
                        "Đăng ký thành công, nhưng mã OTP chưa được gửi tới email của bạn"
                });
            }
        }

        // ==========================
        // TÀI KHOẢN HOÀN TOÀN MỚI
        // ==========================

        // Hash mật khẩu
        const matKhauHash = await bcrypt.hash(matKhau, 10);

        // Tạo OTP gồm 6 chữ số
        const maXacThuc = crypto.randomInt(100000, 1000000);

        // OTP hết hạn sau 5 phút
        const hetHanMaXacThuc =
            new Date(Date.now() + 5 * 60 * 1000);

        // Thêm người dùng
        await ketNoi.execute(
            `INSERT INTO nguoi_dung
            (
                ten_hien_thi,
                email,
                mat_khau,
                ma_xac_thuc,
                het_han_ma_xac_thuc
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                tenHienThi,
                emailNguoiDung,
                matKhauHash,
                maXacThuc,
                hetHanMaXacThuc
            ]
        );

        // Gửi mã xác thực đến email
        const guiEmailThanhCong =
            await guiMaXacThuc(
                emailNguoiDung,
                maXacThuc
            );

        if (guiEmailThanhCong) {
            return res.json({
                thanh_cong: true,
                thong_bao:
                    "Đăng ký thành công. Vui lòng kiểm tra email của bạn."
            });
        }

        return res.json({
            thanh_cong: false,
            thong_bao:
                "Tạo tài khoản thành công, nhưng mã OTP chưa được gửi tới email của bạn"
        });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Đăng ký thất bại"
        });
    }
}

module.exports = dangKy;
