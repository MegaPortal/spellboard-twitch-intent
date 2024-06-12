export default class CookieJar {

    private cookies: Record<string, string> = {};

    constructor(cookieHeader: string) {
        if (cookieHeader) {
            const cookies = cookieHeader.split(';');
            cookies.forEach(cookie => {
                const [key, value] = cookie.split('=');
                this.cookies[key.trim()] = value;
            });
        }
    }

    get(key: string): string | undefined {
        return this.cookies[key];
    }

    set(key: string, value: string): void {
        this.cookies[key] = value;
    }

    toString(): string {
        return Object.entries(this.cookies).map(([key, value]) => `${key}=${value}`).join('; ');
    }
}