// pages/_middleware.js or pages/_middleware.ts

import CookieJar from '@/lib/cookie';
import { checkSession } from '@/lib/session';
import { NextResponse, NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {

    let sessionString: string | undefined = undefined;
    
    const cookies = request.headers.get('Cookie');
    const authorization = request.headers.get('Authorization');

    if (cookies) {
        const cookieJar = new CookieJar(cookies);

        // get session from cookie
        sessionString = cookieJar.get('twitch_session');
        if (!sessionString) {
            return new Response(JSON.stringify({ error: 'no session' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
        sessionString = decodeURIComponent(sessionString);
    } else if (authorization) {
        const parts = authorization.split(' ');
        if (parts.length !== 2) {
            return new Response(JSON.stringify({ error: 'invalid authorization header' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
        if (parts[0].toLowerCase() !== 'bearer') {
            return new Response(JSON.stringify({ error: 'invalid authorization header' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
        sessionString = parts[1];
    }

    if (!sessionString) {
        return new Response(JSON.stringify({ error: 'no session' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    try {
        const session = await checkSession(sessionString, JWT_SECRET!);

        const accessToken = session?.payload?.access_token;
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'invalid session' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('twitch-access-token', accessToken);

        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });
    } catch (e) {

        console.log(e);

        return new Response(JSON.stringify({ error: 'invalid session' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/api/((?!auth/login).*)',
    ]
}