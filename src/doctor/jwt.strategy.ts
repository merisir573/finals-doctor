import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: 'secret-key', // Use the same key as auth-service
    });
  }

  async validate(payload: any) {
    // Token is valid; return user info to the request context
    return { userId: payload.sub, username: payload.username };
  }
}
