const TWITCH_CHANNEL_ENDPOINT = 'https://api.twitch.tv/helix/channels';

// Logic for login, setting session content to cookie
export async function GET(req: Request) {
    try {
        const accessToken = req.headers.get('twitch-access-token');

        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'invalid session' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const url = new URL(req.url);
        const broadcasterId = url.searchParams.get('broadcaster_id');

        if (!broadcasterId) {
            return new Response(JSON.stringify({ error: 'invalid broadcaster_id' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const channelResponse = await fetch(`${TWITCH_CHANNEL_ENDPOINT}?broadcaster_id=${broadcasterId}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const channelBody = await channelResponse.json();

        return new Response(JSON.stringify(channelBody), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: 'internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
