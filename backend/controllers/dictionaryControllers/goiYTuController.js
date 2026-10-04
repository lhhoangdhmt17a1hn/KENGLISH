const goiYTu = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập từ cần tìm"
            });
        }

        const tuKhoa = q.trim();

        const url =
            `https://dict.minhqnd.com/api/v1/suggest?q=${encodeURIComponent(tuKhoa)}&limit=10`;

        const response = await fetch(url);
        const data = await response.json();

        res.json({
            success: true,
            suggestions: data.suggestions || []
        });

    } catch (error) {
        console.error("Lỗi gợi ý từ:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy gợi ý từ lúc này"
        });
    }
};

module.exports = {
    goiYTu
};