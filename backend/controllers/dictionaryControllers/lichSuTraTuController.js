const ketNoi = require("../../config/database");
/*
 * Thêm từ vào lịch sử tra từ.
 *
 * Nếu từ đã tồn tại:
 * cập nhật thời gian để đưa từ lên đầu.
 *
 * Mỗi người dùng chỉ giữ tối đa 20 từ.
 */
const themLichSuTraTu = async (req, res) => {

    try {

        const nguoiDungId = req.nguoiDung.id;

        const { word } = req.body;
        /*
         * Kiểm tra dữ liệu.
         */
        if (!word || !word.trim()) {

            return res.status(400).json({
                thanh_cong: false,
                thong_bao: "Vui lòng cung cấp từ cần lưu"
            });
        }
        /*
         * Chuẩn hóa từ.
         *
         * APPLE -> apple
         * Apple -> apple
         */
        const tu = word
            .trim()
            .toLowerCase();
        /*
         * Nếu từ đã tồn tại:
         * cập nhật thời gian tra.
         *
         * Nếu chưa tồn tại:
         * thêm mới.
         */
        await ketNoi.query(
            `
            INSERT INTO lich_su_tra_tu
                (nguoi_dung_id, tu, tra_luc)

            VALUES (?, ?, NOW())

            ON DUPLICATE KEY UPDATE
                tra_luc = NOW()
            `,
            [
                nguoiDungId,
                tu
            ]
        );
        /*
         * Chỉ giữ lại 20 từ mới nhất.
         *
         * Các từ từ vị trí 21 trở đi
         * sẽ bị xóa.
         */
        await ketNoi.query(
            `
            DELETE FROM lich_su_tra_tu

            WHERE nguoi_dung_id = ?

            AND id NOT IN (

                SELECT id
                FROM (

                    SELECT id

                    FROM lich_su_tra_tu

                    WHERE nguoi_dung_id = ?

                    ORDER BY tra_luc DESC, id DESC

                    LIMIT 20

                ) AS lich_su_moi_nhat

            )
            `,
            [
                nguoiDungId,
                nguoiDungId
            ]
        );


        return res.json({
            thanh_cong: true,
            thong_bao: "Đã lưu lịch sử tra từ"
        });


    } catch (error) {

        console.error(
            "Lỗi lưu lịch sử tra từ:",
            error
        );


        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Không thể lưu lịch sử tra từ"
        });
    }
};
/*
 * Lấy tối đa 20 từ đã tra gần nhất.
 */
const layLichSuTraTu = async (req, res) => {

    try {

        const nguoiDungId =
            req.nguoiDung.id;


        const [danhSach] =
            await ketNoi.query(
                `
                SELECT
                    tu AS word,
                    tra_luc AS searched_at

                FROM lich_su_tra_tu

                WHERE nguoi_dung_id = ?

                ORDER BY tra_luc DESC, id DESC

                LIMIT 20
                `,
                [
                    nguoiDungId
                ]
            );


        return res.json({
            thanh_cong: true,
            history: danhSach
        });


    } catch (error) {

        console.error(
            "Lỗi lấy lịch sử tra từ:",
            error
        );


        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Không thể lấy lịch sử tra từ"
        });
    }
};
/*
 * Xóa toàn bộ lịch sử tra từ
 * của người dùng hiện tại.
 */
const xoaLichSuTraTu = async (req, res) => {

    try {

        const nguoiDungId =
            req.nguoiDung.id;


        await ketNoi.query(
            `
            DELETE FROM lich_su_tra_tu
            WHERE nguoi_dung_id = ?
            `,
            [
                nguoiDungId
            ]
        );


        return res.json({
            thanh_cong: true,
            thong_bao: "Đã xóa lịch sử tra từ"
        });


    } catch (error) {

        console.error(
            "Lỗi xóa lịch sử tra từ:",
            error
        );


        return res.status(500).json({
            thanh_cong: false,
            thong_bao: "Không thể xóa lịch sử tra từ"
        });
    }
};



module.exports = {
    themLichSuTraTu,
    layLichSuTraTu,
    xoaLichSuTraTu
};