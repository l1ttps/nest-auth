import * as jwt from 'jsonwebtoken';

export class JwtStrategy {
  static generate(payload: object, serectKey: string) {
    return jwt.sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + 2 * 60 },
      serectKey,
    );
  }
  static decode(token: string) {
    return jwt.decode(token.replace('Bearer ', ''));
  }
  static verify(token: string, serectKeyJwt: string) {
    return jwt.verify(token.replace('Bearer ', ''), serectKeyJwt);
  }
}
