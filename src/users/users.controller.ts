import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Render,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from './schemas/user.schema';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user: UserDocument = await this.usersService.validateUser(
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const token = await this.authService.generateToken(user);
    return { token };
  }

  @Get('find-by-email')
  async findByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Verifica se o endereço foi fornecido corretamente
    if (!createUserDto.address || !createUserDto.address.zip) {
      throw new BadRequestException('Endereço não fornecido.');
    }
    return this.usersService.create(createUserDto);
  }

  @Get('all') // Rota para listar todos os usuários
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('home') // Rota para renderizar a página home
  @Render('home')
  async home() {
    const users = await this.usersService.findAll();
    return { users }; // Passa os usuários para o template 'home'
  }

  @Post('reset-password') // Rota para o endpoint de reset de senha
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    const { email } = resetPasswordDto;
    return this.usersService.sendPasswordResetEmail(email);
  }

  @Get('address/:zip')
  async getAddressByZip(@Param('zip') zip: string) {
    try {
      const address = await this.usersService.getAddressByZip(zip);
      return address;
    } catch (error) {
      throw new NotFoundException(
        'Endereço não encontrado para o CEP fornecido',
      );
    }
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  async findOne(@Param('id') id: string) {
    // Simula uma situação onde o recurso não é encontrado
    throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
  }
}
