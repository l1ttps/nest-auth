import * as jwt from 'jsonwebtoken';
interface PayloadToken {
    id: string,
    exp: number,
    iat?: number
}
export default class Jwt {
    static generate(userId: string, serectKey: string, ttl) {
        const payload = {
            id: userId,
            exp: Math.floor(Date.now() / 1000) + ttl * 86400,
        };
        return jwt.sign(payload, serectKey);
    }
    static decode(token: string): PayloadToken {
        return jwt.decode(token.replace('Bearer ', ''));
    }
    static verify(token: string, serectKeyJwt: string): boolean {
        return jwt.verify(token.replace('Bearer ', ''), serectKeyJwt);
    }
}