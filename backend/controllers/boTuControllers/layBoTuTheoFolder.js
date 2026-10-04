const ketNoi = require("../../config/database");

const layBoTuTheoFolder = async (req, res) => {
    try {
        const nguoiDungId = req.nguoiDung.id;
        const folderId = req.params.folderId;


        // Kiểm tra folder có thuộc user không
        const [folder] = await ketNoi.query(
            `
            SELECT
                id,
                ten_folder

            FROM folder

            WHERE id = ?
            AND nguoi_dung_id = ?
            `,
            [
                folderId,
                nguoiDungId
            ]
        );


        if (folder.length === 0) {
            return res.status(404).json({
                thanh_cong: false,
                thong_bao: "Folder không tồn tại"
            });
        }


        // Lấy các bộ từ trong folder
        const [boTu] = await ketNoi.query(
            `
            SELECT
                id,
                ten_bo_tu,
                mo_ta,
                ngay_tao

            FROM bo_tu

            WHERE folder_id = ?
            AND nguoi_dung_id = ?

            ORDER BY ngay_tao DESC
            `,
            [
                folderId,
                nguoiDungId
            ]
        );


        return res.status(200).json({
            thanh_cong: true,

            data: {
                folder: folder[0],
                bo_tu: boTu
            }
        });

    } catch (error) {

        console.error("Lỗi lấy bộ từ trong folder:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Lỗi server"
        });
    }
};

module.exports = layBoTuTheoFolder;