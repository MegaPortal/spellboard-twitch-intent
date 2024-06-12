
// singleton function to login using fetch to '/api/auth/login'
// and set session to cookie

let loginPromise: Promise<Response> | null = null;

let session: string | null = null;

async function login() {
    if (loginPromise) {
        return loginPromise;
    }

    let p = fetch('/api/auth/login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    loginPromise = p;

    try {
        const response = await p;
        const body = await response.json();
        session = body.session;
        return response;
    } finally {
        loginPromise = null;
    }
}

export default async function authFetch(url: string, init: RequestInit): Promise<Response> {

    const response = await fetch(url, {
        ...init,
        headers: {
            ...init.headers,
            'Authorization': session ? `Bearer ${session}` : '',
        }
    });
   
    if (response.status === 401) {
        const loginResponse = await login();
        if (loginResponse.status === 200) {
            return await fetch(url, {
                ...init,
                headers: {
                    ...init.headers,
                    'Authorization': session ? `Bearer ${session}` : '',
                }
            });
        }
    }

    return response;
}