export const dynamic = "force-dynamic";

const TWITCH_STREAMS_ENDPOINT = 'https://api.twitch.tv/helix/streams';

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
        const userId = url.searchParams.get('user_id');

        if (!userId) {
            return new Response(JSON.stringify({ error: 'invalid user_id' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const streamsResponse = await fetch(`${TWITCH_STREAMS_ENDPOINT}?user_id=${userId}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!streamsResponse.ok) {
            return new Response(JSON.stringify({ error: 'failed to fetch streams' }), {
                status: streamsResponse.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const streamsBody = await streamsResponse.json();

        return new Response(JSON.stringify(streamsBody), {
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
