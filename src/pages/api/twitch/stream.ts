import { NextApiRequest, NextApiResponse } from 'next';

const TWITCH_STREAMS_ENDPOINT = 'https://api.twitch.tv/helix/streams';

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
            return new Response(JSON.stringify({ error: 'invalid session' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const url = new URL(req.url!, 'http://localhost');
        const userId = url.searchParams.get('user_id');

        if (!userId) {
            return res.status(400).json({ error: 'invalid user_id' });
        }

        const streamsResponse = await fetch(`${TWITCH_STREAMS_ENDPOINT}?user_id=${userId}`, {
            cache: 'no-cache',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (streamsResponse.status === 401) {
            return res.status(401).json({ error: 'invalid session' });
        }

        if (!streamsResponse.ok) {
            return res.status(streamsResponse.status).json({ error: 'failed to fetch streams' });
        }

        const streamsBody = await streamsResponse.json();

        return res.status(200).json(streamsBody);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal server error' });
    }
}
