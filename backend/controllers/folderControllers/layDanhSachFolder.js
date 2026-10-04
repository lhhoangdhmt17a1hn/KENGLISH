const ketNoi = require("../../config/database");

const layDanhSachFolder = async (req, res) => {
    try {
        const nguoiDungId = req.nguoiDung.id;

        const [folders] = await ketNoi.query(
            `
            SELECT
                f.id,
                f.ten_folder,
                f.ngay_tao,
                COUNT(bt.id) AS so_bo_tu

            FROM folder f

            LEFT JOIN bo_tu bt
                ON bt.folder_id = f.id

            WHERE f.nguoi_dung_id = ?

            GROUP BY
                f.id,
                f.ten_folder,
                f.ngay_tao

            ORDER BY f.ngay_tao DESC
            `,
            [nguoiDungId]
        );

        return res.status(200).json({
            thanh_cong: true,
            data: folders
        });

    } catch (error) {

        console.error("Lỗi lấy folder:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Lỗi server"
        });
    }
};

module.exports = layDanhSachFolder;