import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  complemento?: string; // Este campo é opcional, caso a API retorne
  // Adicione outros campos que a API possa retornar, se necessário
}

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  // @IsNotEmpty()
  // @IsString()
  // zip: string;
  @IsNotEmpty()
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP inválido' })
  zip: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
