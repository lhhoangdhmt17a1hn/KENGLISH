const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ketNoi = require("../../config/database");
const { guiMaXacThuc } = require("../../services/emailService");

async function dangKy(req, res) {
  try {
    // Lấy dữ liệu Android gửi lên
    const { ten_hien_thi = "", email = "", mat_khau = "" } = req.body;

    const tenHienThi = ten_hien_thi.trim();
    const emailNguoiDung = email.trim();
    const matKhau = mat_khau;

    // Kiểm tra dữ liệu
    if (!tenHienThi || !emailNguoiDung || !matKhau) {
      return res.json({
        thanh_cong: false,
        thong_bao: "Vui lòng điền đủ thông tin yêu cầu",
      });
    }

    // Kiểm tra định dạng email
    const emailHopLe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailHopLe.test(emailNguoiDung)) {
      return res.json({
        thanh_cong: false,
        thong_bao: "Email chưa được xác thực",
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (matKhau.length < 6) {
      return res.json({
        thanh_cong: false,
        thong_bao: "Mật khẩu phải chứa ít nhất 6 ký tự",
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const [nguoiDung] = await ketNoi.execute(
      "SELECT id FROM nguoi_dung WHERE email = ?",
      [emailNguoiDung],
    );

    if (nguoiDung.length > 0) {
      return res.json({
        thanh_cong: false,
        thong_bao: "Email đã tồn tại",
      });
    }

    // Hash mật khẩu
    const matKhauHash = await bcrypt.hash(matKhau, 10);

    // Tạo OTP gồm 6 chữ số
    const maXacThuc = crypto.randomInt(100000, 1000000);

    // OTP hết hạn sau 5 phút
    const hetHanMaXacThuc = new Date(Date.now() + 5 * 60 * 1000);

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
      [tenHienThi, emailNguoiDung, matKhauHash, maXacThuc, hetHanMaXacThuc],
    );

    // Phần gửi OTP qua email sẽ thêm sau
    // Gửi mã xác thực đến email
    const guiEmailThanhCong = await guiMaXacThuc(emailNguoiDung, maXacThuc);

    if (guiEmailThanhCong) {
      return res.json({
        thanh_cong: true,
        thong_bao: "Đăng ký thành công. Vui lòng kiểm tra email của bạn.",
      });
    }

    return res.json({
      thanh_cong: false,
      thong_bao:
        "Tạo tài khoản thành công, nhưng mã OTP chưa được gửi tới email của bạn",
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    return res.status(500).json({
      thanh_cong: false,
      thong_bao: "Đăng ký thất bại",
    });
  }
}

module.exports = dangKy;