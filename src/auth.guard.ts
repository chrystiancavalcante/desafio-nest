// src/auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      this.redirectToLogin(request);
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Adiciona o usuário decodificado à requisição
      return true;
    } catch (err) {
      this.redirectToLogin(request);
      return false;
    }
  }

  private redirectToLogin(request) {
    // Redirecionamento para a página de login
    const returnUrl = encodeURIComponent(request.url);
    request.res.redirect(`/login?returnUrl=${returnUrl}`);
  }
}
