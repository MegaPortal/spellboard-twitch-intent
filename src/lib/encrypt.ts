import crypto from 'crypto-js'

// Encrypt function
export async function aesEncrypt(data: string, key: string): Promise<string> {
    const encrypted = crypto.AES.encrypt(data, key).toString();
    return encrypted;
}

// Decrypt function
export async function aesDecrypt(data: string, key: string): Promise<string> {
    const decrypted = crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8);
    return decrypted;
}