
// singleton function to login using fetch to '/api/auth/login'
// and set session to cookie

let loginPromise: Promise<Response> | null = null;

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
        return await p;
    } finally {
        loginPromise = null;
    }
}

export default async function authFetch(url: string, init: RequestInit): Promise<Response> {

    const response = await fetch(url, init);
   
    if (response.status === 401) {
        const loginResponse = await login();
        if (loginResponse.status === 200) {
            return await fetch(url, init);
        }
    }

    return response;
}