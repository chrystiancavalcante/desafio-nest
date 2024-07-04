import {
  Controller,
  Get,
  Redirect,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get()
  @Redirect('/login') // Redireciona para a rota de login
  Index() {}

  @Get('index')
  @Render('index')
  index() {}

  @Get('login')
  @Render('login')
  login() {}

  @Get('recuperar-senha')
  @Render('recuperar-senha')
  recuperarSenha() {}

  @Get()
  @Render('index')
  getIndex() {}

  @Get('home')
  @UseGuards(AuthGuard)
  getHome(@Res() res: Response) {
    return res.render('home', { title: 'Home Page', message: 'Welcome!' });
  }

  @Get('cadastro')
  @Render('cadastro')
  cadastro() {}
}
