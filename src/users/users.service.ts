import {
  BadRequestException,
  //BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  //UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserDocument } from './schemas/user.schema';
import {
  AddressDto,
  CreateUserDto,
  //ViaCepResponse,
} from './dto/create-user.dto';
import * as crypto from 'crypto';
//import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
//import { NormalizePayloadInterceptor } from './interceptors/normalize-payload.interceptor';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const newUser = new this.userModel(createUserDto);
  //   return newUser.save();
  // }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    //Usando bcrypt para hashing de senha:
    // const isPasswordValid = await user.comparePassword(password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Credenciais inválidas');
    // }
    // return user;

    // Aqui está uma implementação básica (não segura):
    if (user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  // async getAddressByZip(zip: string): Promise<AddressDto> {
  //   const url = `https://viacep.com.br/ws/${zip}/json/`;

  //   try {
  //     // Tipamos a resposta da API para que o TypeScript saiba quais propriedades esperar
  //     const response: AxiosResponse<ViaCepResponse> = await lastValueFrom(
  //       this.httpService.get<ViaCepResponse>(url),
  //     );

  //     const data = response.data;

  //     return {
  //       street: data.logradouro,
  //       neighborhood: data.bairro,
  //       city: data.localidade,
  //       state: data.uf,
  //       zip: data.cep,
  //       number: '',
  //     };
  //   } catch (error) {
  //     throw new Error(`Erro ao buscar o endereço pelo CEP: ${error.message}`);
  //   }
  // }

  // Função para criar um novo usuário

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('CreateUserDto in Service:', createUserDto); // Verificação dos dados recebidos
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Email já está em uso.');
    }
    const { address } = createUserDto;

    // Verificação para garantir que 'address' não está undefined
    if (!address) {
      throw new HttpException(
        'Endereço não fornecido.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { zip, number } = address;

    if (!zip) {
      throw new HttpException('CEP não fornecido.', HttpStatus.BAD_REQUEST);
    }
    if (!number) {
      throw new HttpException(
        'Número do endereço não fornecido.',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('ZIP:', zip); // Log para verificação

    // Validação e busca de endereço
    const fullAddress = await this.getAddressByZip(zip);

    // Atualizar o DTO com o endereço completo
    const newUser = new this.userModel({
      ...createUserDto,
      address: {
        ...address,
        ...fullAddress,
        number: number,
      },
    });

    return newUser.save();
  }

  async getAddressByZip(zip: string): Promise<AddressDto> {
    const url = `https://viacep.com.br/ws/${zip}/json/`;

    const response = await firstValueFrom(this.httpService.get(url));

    const { data } = response;

    if (!data || data.erro) {
      throw new HttpException(
        'CEP inválido ou não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      zip: data.cep || '',
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      number: '', // Número deve ser fornecido pelo usuário
      city: data.localidade || '',
      state: data.uf || '',
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar um token único para a recuperação de senha
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Salvar o token na coleção do usuário (geralmente em um campo 'resetToken' junto com 'resetTokenExpires')
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora de expiração do token
    await user.save();

    // Enviar o e-mail de recuperação de senha com o token de recuperação
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha',
      text: `Você solicitou a recuperação de senha. Utilize este token para redefinir sua senha: ${resetToken}`,
    });

    console.log(`Email de recuperação de senha enviado para: ${email}`);
  }
}
