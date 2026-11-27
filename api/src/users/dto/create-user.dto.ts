import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// O DTO descreve e valida que chega no body do POST /users.
// Os decorators do class-validator fazem o papel do Zod de validação.
// Os @ApiProperty fazem os campos aparecerem no Swagger.
export class CreateUserDto {
  @ApiProperty({ example: 'Pedro Silva' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Informe seu nome' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name: string;

  @ApiProperty({ example: 'maria@email.com' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @ApiProperty({ example: 'senha1234', minLength: 8 })
  @IsString()
  @IsNotEmpty({ message: 'Informe sua senha' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}
