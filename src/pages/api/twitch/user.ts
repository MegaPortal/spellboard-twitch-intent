import { NextApiRequest, NextApiResponse } from 'next';

const TWITCH_USER_ENDPOINT = 'https://api.twitch.tv/helix/users';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'method not allowed' });
    }

    try {
        const accessToken = req.headers['twitch-access-token'] as string;

        if (!accessToken) {
            return res.status(401).json({ error: 'invalid session' });
        }

        const url = new URL(req.url!, 'http://localhost');
        // get parameter query from url
        const query = url.searchParams.get('query');

        if (!query) {
            return res.status(400).json({ error: 'invalid query' });
        }

        const userResponse = await fetch(`${TWITCH_USER_ENDPOINT}?login=${query}`, {
            cache: 'no-cache',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (userResponse.status === 401) {
            return res.status(401).json({ error: 'invalid session' });
        }

        if (!userResponse.ok) {
            return res.status(userResponse.status).json({ error: 'failed to fetch user' });
        }

        const userBody = await userResponse.json();

        return res.status(200).json(userBody);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal server error' });
    }
}