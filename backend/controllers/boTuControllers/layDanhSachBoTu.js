const ketNoi = require("../../config/database");

const layDanhSachBoTu = async (req, res) => {
    try {
        const nguoiDungId = req.nguoiDung.id;

        const [boTu] = await ketNoi.query(
            `
            SELECT
                id,
                ten_bo_tu,
                mo_ta,
                folder_id,
                ngay_tao

            FROM bo_tu

            WHERE nguoi_dung_id = ?
            AND folder_id IS NULL

            ORDER BY ngay_tao DESC
            `,
            [nguoiDungId]
        );

        return res.status(200).json({
            thanh_cong: true,
            data: boTu
        });

    } catch (error) {

        console.error("Lỗi lấy bộ từ:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Lỗi server"
        });
    }
};

module.exports = layDanhSachBoTu;