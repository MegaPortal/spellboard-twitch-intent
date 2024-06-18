import { NextApiRequest, NextApiResponse } from 'next';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { aesEncrypt } from '@/lib/encrypt';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_SECRET;
const TWITCH_ACCESS_TOKEN_ENDPOINT = 'https://id.twitch.tv/oauth2/token';
const JWT_SECRET = process.env.JWT_SECRET;

// logic for login, setting session content to cookie
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !JWT_SECRET) {
        return res.status(500).json({ error: 'env is not set' });
    }

    const tokenResponse = await fetch(TWITCH_ACCESS_TOKEN_ENDPOINT, {
        cache: 'no-cache',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    });

    const body = await tokenResponse.json();

    // number, the milliseconds since epoch when the token will expire
    const bodyExpiresIn = body.expires_in;

    // no longer than 1 hour
    const maxExpiresIn = 60 * 60;
    const expiresIn = Math.min(bodyExpiresIn, maxExpiresIn);

    // encrypt the body into jwt token
    const loginInfo = await jwt.sign(body, JWT_SECRET);
    const loginInfoBuffer = await aesEncrypt(loginInfo, JWT_SECRET);

    res.setHeader('Set-Cookie', `twitch_session=${encodeURIComponent(loginInfoBuffer)}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${expiresIn}`);
    return res.status(200).json({
        expiresIn,
        session: loginInfoBuffer,
    });
}
