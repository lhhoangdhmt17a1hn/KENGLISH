const nodemailer = require("nodemailer");

// Tạo cấu hình gửi email qua Gmail SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_GUI,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Gửi mã xác thực đến email người dùng
async function guiMaXacThuc(email, maXacThuc) {
    try {
        await transporter.sendMail({
            from: `"Kenglish" <${process.env.EMAIL_GUI}>`,
            to: email,

            subject: "Kenglish - Xác thực Email",

            html: `
                <h2>Xác minh tài khoản Kenglish của bạn</h2>

                <p>Mã xác minh của bạn là:</p>

                <h1>${maXacThuc}</h1>

                <p>Mã sẽ hết hạn sau 5 phút.</p>
            `,

            text:
                `Mã xác thực tài khoản Kenglish của bạn là: ${maXacThuc}. ` +
                `Mã code này sẽ hết hạn trong 5 phút.`
        });

        return true;

    } catch (error) {
        console.error("Lỗi gửi email:", error);

        return false;
    }
}

module.exports = {
    guiMaXacThuc
};