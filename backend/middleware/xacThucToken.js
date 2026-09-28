const jwt = require("jsonwebtoken");

function xacThucToken(req, res, next) {
    try {
        // Lấy Authorization header
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                thanh_cong: false,
                thong_bao: "Bạn chưa đăng nhập"
            });
        }

        // Authorization: Bearer TOKEN
        const [loaiToken, token] = authorization.split(" ");

        if (loaiToken !== "Bearer" || !token) {
            return res.status(401).json({
                thanh_cong: false,
                thong_bao: "Token không hợp lệ"
            });
        }

        // Kiểm tra và giải mã JWT
        const duLieuToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Lưu thông tin người dùng vào request
        req.nguoiDung = duLieuToken;

        // Cho phép request đi tiếp
        next();

    } catch (error) {
        return res.status(401).json({
            thanh_cong: false,
            thong_bao: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
}

module.exports = xacThucToken;