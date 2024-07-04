import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: UserDocument): Promise<string> {
    const payload = { sub: user._id, email: user.email }; // Usando user._id do Mongoose
    return this.jwtService.sign(payload);
  }
}
