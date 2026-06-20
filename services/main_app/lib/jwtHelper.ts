

import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY || "super-secure-jwt-secret";

function ft_sign(data: object, expiresIn?: string | number) {
    if (expiresIn)
        return jwt.sign(data, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });

    const token = jwt.sign(data, secret);
    return token;
}

function ft_verify(token: string) {
    try {
        const payload = jwt.verify(token, secret);
        if (typeof payload === 'string')
            return JSON.parse(payload) as Record<string, unknown>;

        return payload as JwtPayload;
    } catch {
        return null;
    }
}

export { ft_sign, ft_verify }
