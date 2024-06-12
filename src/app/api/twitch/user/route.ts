export const dynamic = "force-dynamic";

const TWITCH_USER_ENDPOINT = 'https://api.twitch.tv/helix/users';

// logic for login, setting session content to cookie
export async function GET(req: Request) {

    try {
        const accessToken = req.headers.get('twitch-access-token');

        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'invalid session' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        const url = new URL(req.url!);
        // get parameter query from url
        const query = url.searchParams.get('query');

        if (!query) {
            return new Response(JSON.stringify({ error: 'invalid query' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        const userResponse = await fetch(`${TWITCH_USER_ENDPOINT}?login=${query}`, {
            cache: 'no-cache',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const userBody = await userResponse.json();

        return new Response(JSON.stringify(userBody), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: 'invalid session' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}