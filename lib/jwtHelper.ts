

import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET_KEY || "super-secure-jwt-secret";

function ft_sign(data: any) {
    const token = jwt.sign(JSON.stringify(data), secret, { expiresIn: "7d" });
    return token;
}

function ft_verify(token: string) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { ft_sign, ft_verify }
