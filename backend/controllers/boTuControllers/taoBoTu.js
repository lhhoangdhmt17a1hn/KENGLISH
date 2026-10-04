const ketNoi = require("../../config/database");

const taoBoTu = async (req, res) => {
    try {
        const nguoiDungId = req.nguoiDung.id;

        const {
            ten_bo_tu,
            mo_ta,
            folder_id
        } = req.body;

        if (!ten_bo_tu || !ten_bo_tu.trim()) {
            return res.status(400).json({
                success: false,
                message: "Tên bộ từ không được để trống"
            });
        }

        const tenBoTu = ten_bo_tu.trim();
        const moTa = mo_ta?.trim() || null;

        if (tenBoTu.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Tên bộ từ không được vượt quá 100 ký tự"
            });
        }


        // Nếu tạo bộ từ trong folder
        if (folder_id) {

            const [folder] = await ketNoi.query(
                `
                SELECT id
                FROM folder
                WHERE id = ?
                AND nguoi_dung_id = ?
                `,
                [
                    folder_id,
                    nguoiDungId
                ]
            );

            if (folder.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Folder không tồn tại"
                });
            }
        }


        const [ketQua] = await ketNoi.query(
            `
            INSERT INTO bo_tu (
                nguoi_dung_id,
                folder_id,
                ten_bo_tu,
                mo_ta
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                nguoiDungId,
                folder_id || null,
                tenBoTu,
                moTa
            ]
        );


        return res.status(201).json({
            success: true,
            message: "Tạo bộ từ thành công",

            data: {
                id: ketQua.insertId,
                ten_bo_tu: tenBoTu,
                mo_ta: moTa,
                folder_id: folder_id || null
            }
        });

    } catch (error) {

        console.error("Lỗi tạo bộ từ:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

module.exports = taoBoTu;