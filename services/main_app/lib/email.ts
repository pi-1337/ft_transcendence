import nodemailer from "nodemailer";

type SendOtpMailParams = {
    to: string;
    code: string;
    expiresInMinutes: number;
};

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !portRaw || !user || !pass)
        return null;

    const port = parseInt(portRaw, 10);
    if (isNaN(port))
        return null;

    return nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user,
            pass,
        },
    });
}

export async function sendOtpEmail({ to, code, expiresInMinutes }: SendOtpMailParams) {
    const from = process.env.SMTP_FROM || "no-reply@ft-transcendence.local";
    const transporter = getTransporter();
    const requireSmtp = process.env.TWO_FACTOR_REQUIRE_SMTP === 'true';

    const subject = "Your verification code";
    const text = `Your verification code is ${code}. It expires in ${expiresInMinutes} minutes.`;

    if (!transporter) {
        console.log(`[2FA-DEV] OTP for ${to}: ${code}`);
        return;
    }

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
        });
    } catch (error) {
        if (requireSmtp)
            throw error;

        console.log(`[2FA-DEV] SMTP send failed, fallback OTP for ${to}: ${code}`);
    }
}
