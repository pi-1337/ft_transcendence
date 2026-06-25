import bcrypt from "bcrypt";
import { TwoFactorPurpose } from "@prisma/client";
import { prisma } from "./prisma";
import { sendOtpEmail } from "./email";

const OTP_LENGTH = parseInt(process.env.TWO_FACTOR_OTP_LENGTH || "6", 10);
const OTP_TTL_MINUTES = parseInt(process.env.TWO_FACTOR_OTP_TTL_MINUTES || "5", 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.TWO_FACTOR_OTP_MAX_ATTEMPTS || "5", 10);
const OTP_MAX_RESENDS = parseInt(process.env.TWO_FACTOR_OTP_MAX_RESENDS || "3", 10);
const OTP_RESEND_COOLDOWN_SECONDS = parseInt(process.env.TWO_FACTOR_OTP_RESEND_COOLDOWN_SECONDS || "60", 10);

export type TwoFactorErrorCode =
    | "OTP_INVALID"
    | "OTP_EXPIRED"
    | "OTP_MAX_ATTEMPTS"
    | "OTP_RESEND_COOLDOWN"
    | "OTP_MAX_RESENDS"
    | "OTP_NOT_FOUND";

function createNumericOtp(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++)
        result += Math.floor(Math.random() * 10).toString();

    return result;
}

export function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!local || !domain)
        return email;

    if (local.length <= 2)
        return `${local[0] || "*"}*@${domain}`;

    return `${local[0]}${"*".repeat(Math.max(1, local.length - 2))}${local[local.length - 1]}@${domain}`;
}

export async function startTwoFactorChallenge(userId: number, destinationEmail: string, purpose: TwoFactorPurpose) {
    const code = createNumericOtp(OTP_LENGTH);
    const codeHash = await bcrypt.hash(code, 10);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.twoFactorChallenge.updateMany({
        where: {
            userId,
            purpose,
            consumedAt: null,
        },
        data: {
            consumedAt: now,
        },
    });

    await prisma.twoFactorChallenge.create({
        data: {
            userId,
            purpose,
            codeHash,
            expiresAt,
            lastSentAt: now,
        },
    });

    await sendOtpEmail({
        to: destinationEmail,
        code,
        expiresInMinutes: OTP_TTL_MINUTES,
    });

    return {
        expiresInMinutes: OTP_TTL_MINUTES,
        maskedEmail: maskEmail(destinationEmail),
    };
}

export async function resendTwoFactorChallenge(userId: number, destinationEmail: string, purpose: TwoFactorPurpose) {
    const challenge = await prisma.twoFactorChallenge.findFirst({
        where: {
            userId,
            purpose,
            consumedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!challenge)
        return { ok: false as const, error: "OTP_NOT_FOUND" as TwoFactorErrorCode };

    if (challenge.expiresAt.getTime() < Date.now())
        return { ok: false as const, error: "OTP_EXPIRED" as TwoFactorErrorCode };

    if (challenge.resendCount >= OTP_MAX_RESENDS)
        return { ok: false as const, error: "OTP_MAX_RESENDS" as TwoFactorErrorCode };

    const elapsedSeconds = Math.floor((Date.now() - challenge.lastSentAt.getTime()) / 1000);
    if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS)
        return { ok: false as const, error: "OTP_RESEND_COOLDOWN" as TwoFactorErrorCode, retryAfter: OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds };

    const code = createNumericOtp(OTP_LENGTH);
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.twoFactorChallenge.update({
        where: { id: challenge.id },
        data: {
            codeHash,
            expiresAt,
            resendCount: { increment: 1 },
            lastSentAt: new Date(),
            attempts: 0,
        },
    });

    await sendOtpEmail({
        to: destinationEmail,
        code,
        expiresInMinutes: OTP_TTL_MINUTES,
    });

    return {
        ok: true as const,
        expiresInMinutes: OTP_TTL_MINUTES,
        maskedEmail: maskEmail(destinationEmail),
    };
}

export async function verifyTwoFactorChallenge(userId: number, code: string, purpose: TwoFactorPurpose) {
    const challenge = await prisma.twoFactorChallenge.findFirst({
        where: {
            userId,
            purpose,
            consumedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!challenge)
        return { ok: false as const, error: "OTP_NOT_FOUND" as TwoFactorErrorCode };

    if (challenge.expiresAt.getTime() < Date.now())
        return { ok: false as const, error: "OTP_EXPIRED" as TwoFactorErrorCode };

    if (challenge.attempts >= OTP_MAX_ATTEMPTS)
        return { ok: false as const, error: "OTP_MAX_ATTEMPTS" as TwoFactorErrorCode };

    const matches = await bcrypt.compare(code, challenge.codeHash);
    if (!matches) {
        await prisma.twoFactorChallenge.update({
            where: { id: challenge.id },
            data: {
                attempts: { increment: 1 },
            },
        });

        if (challenge.attempts + 1 >= OTP_MAX_ATTEMPTS)
            return { ok: false as const, error: "OTP_MAX_ATTEMPTS" as TwoFactorErrorCode };

        return { ok: false as const, error: "OTP_INVALID" as TwoFactorErrorCode };
    }

    await prisma.twoFactorChallenge.update({
        where: { id: challenge.id },
        data: {
            consumedAt: new Date(),
        },
    });

    return { ok: true as const };
}
