const traTu = async (req, res) => {
    try {
        const { word } = req.query;

        // Kiểm tra từ cần tra
        if (!word || !word.trim()) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập từ cần tra"
            });
        }

        const tuCanTra = word.trim();

        // Gọi API từ điển Anh -> Việt
        const url =
            `https://dict.minhqnd.com/api/v1/lookup?word=${encodeURIComponent(tuCanTra)}&lang=en&def_lang=vi`;

        const response = await fetch(url);
        const data = await response.json();

        // Không tìm thấy từ
        if (!data.exists || !data.results || data.results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy từ"
            });
        }

        const ketQua = data.results[0];

        // Lấy IPA đầu tiên nếu có
        const ipa =
            ketQua.pronunciations?.length > 0
                ? ketQua.pronunciations[0].ipa
                : null;

        // Chỉ lấy những dữ liệu Kenglish cần
        const meanings = ketQua.meanings
            ?.slice(0, 3)
            .map((meaning) => ({
                definition: meaning.definition,
                pos: meaning.pos,
                example: meaning.example
            })) || [];

        res.json({
            success: true,
            word: data.word,
            language: ketQua.lang_code,
            ipa: ipa,
            audio: ketQua.audio
                ? `https://dict.minhqnd.com${ketQua.audio}`
                : null,
            meanings: meanings
        });

    } catch (error) {
        console.error("Lỗi tra từ:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tra từ lúc này"
        });
    }
};



module.exports = {
    traTu
};