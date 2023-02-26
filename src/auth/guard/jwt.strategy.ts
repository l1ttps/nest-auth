import * as jwt from 'jsonwebtoken';

const EXP_2_MIN = 3 * 60;
export class JwtStrategy {
  static generate(payload: object, serectKey: string) {
    return jwt.sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + EXP_2_MIN },
      serectKey,
    );
  }
  static decode(token: string) {
    return jwt.decode(token.replace('Bearer ', ''));
  }
  static verify(token: string, serectKeyJwt: string) {
    return jwt.verify(token.replace('Bearer ', ''), serectKeyJwt);
  }

  static getPayload(headers) {
    return this.decode(headers.authorization);
  }
}
