import { aesDecrypt } from "./encrypt";
import jwt from '@tsndr/cloudflare-worker-jwt';


export async function checkSession(encryptedSession: string, secret: string): Promise<any> {

    if (!secret) {
        throw new Error('env is not set');
    }

    // base64 to uint8Array
    
    const decryptedSession = await aesDecrypt(encryptedSession, secret);

    const decode = await jwt.decode(decryptedSession);

    return decode;
}