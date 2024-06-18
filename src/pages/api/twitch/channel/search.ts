import { NextApiRequest, NextApiResponse } from 'next';

const TWITCH_CHANNEL_ENDPOINT = 'https://api.twitch.tv/helix/search/channels';

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
        const query = url.searchParams.get('query');

        if (!query) {
            return res.status(400).json({ error: 'invalid query' });
        }

        const channelResponse = await fetch(`${TWITCH_CHANNEL_ENDPOINT}?query=${query}&first=20&live_only=true`, {
            cache: 'no-cache',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (channelResponse.status === 401) {
            return res.status(401).json({ error: 'invalid session' });
        }

        if (!channelResponse.ok) {
            return res.status(channelResponse.status).json({ error: 'failed to fetch streams' });
        }

        const channelBody = await channelResponse.json();

        return res.status(200).json(channelBody);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal server error' });
    }
}