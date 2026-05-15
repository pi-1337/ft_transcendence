

export function get42OAuthURL() {
    const params = new URLSearchParams({
        client_id: process.env.UID_42 as string,
        redirect_uri: process.env.FALLBACK_42 as string,
        response_type: 'code'
    })
    return `https://api.intra.42.fr/oauth/authorize?${params}`;
}

export type User_42 = {
    login: string;
    email: string;
    first_name: string;
    last_name: string;
}

export async function authorizeUserByCode(code: string) {
    try {
        const response = await fetch("https://api.intra.42.fr/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.UID_42 as string,
                client_secret:
                    process.env.SECRET_42 as string,
                code,
                redirect_uri:
                    process.env.FALLBACK_42 as string,
            }),
        });

        const { access_token } = await response.json();

        const userRes = await fetch("https://api.intra.42.fr/v2/me", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const user = await userRes.json();
        const { email, first_name, last_name, login } = user;

        return { email, first_name, last_name, login } as User_42;
    } catch (error) {
        return null;
    }

}

