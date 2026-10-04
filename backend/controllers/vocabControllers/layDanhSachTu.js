const db = require("../../config/database");

const layDanhSachTu = async (req, res) => {
    try {

        const nguoiDungId = req.nguoiDung.id;
        const boTuId = req.params.boTuId;


        // Kiểm tra bộ từ
        const [boTu] = await db.query(
            `
            SELECT
                id,
                ten_bo_tu,
                mo_ta
            FROM bo_tu
            WHERE id = ?
            AND nguoi_dung_id = ?
            `,
            [
                boTuId,
                nguoiDungId
            ]
        );


        if (boTu.length === 0) {
            return res.status(404).json({
                thanh_cong: false,
                thong_bao: "Bộ từ không tồn tại"
            });
        }


        // Lấy danh sách từ
        const [danhSachTu] = await db.query(
            `
            SELECT
                id,
                tu_goc,
                phien_am,
                loai_tu,
                nghia_tieng_viet,
                cau_vi_du,
                tu_dong_nghia,
                tu_trai_nghia,
                da_thuoc,
                ngay_tao
            FROM tu_vung
            WHERE bo_tu_id = ?
            ORDER BY ngay_tao DESC
            `,
            [boTuId]
        );


        return res.status(200).json({
            thanh_cong: true,

            data: {
                bo_tu: boTu[0],
                tong_tu: danhSachTu.length,
                tu_vung: danhSachTu
            }
        });

    } catch (error) {

        console.error("Lỗi lấy danh sách từ:", error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Lỗi server"
        });
    }
};

module.exports = layDanhSachTu;