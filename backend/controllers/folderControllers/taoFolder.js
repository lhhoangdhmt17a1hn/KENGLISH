const ketNoi = require("../../config/database");

const taoFolder = async (req, res) => {
    try {
        const nguoiDungId = req.nguoiDung.id;
        const { ten_folder } = req.body;

        if (!ten_folder || !ten_folder.trim()) {
            return res.status(400).json({
                success: false,
                message: "Tên folder không được để trống"
            });
        }

        const tenFolder = ten_folder.trim();

        if (tenFolder.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Tên folder không được vượt quá 100 ký tự"
            });
        }

        const [ketQua] = await ketNoi.query(
            `
            INSERT INTO folder (
                nguoi_dung_id,
                ten_folder
            )
            VALUES (?, ?)
            `,
            [
                nguoiDungId,
                tenFolder
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Tạo folder thành công",
            data: {
                id: ketQua.insertId,
                ten_folder: tenFolder
            }
        });

    } catch (error) {
        console.error("Lỗi tạo folder:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

module.exports = taoFolder;