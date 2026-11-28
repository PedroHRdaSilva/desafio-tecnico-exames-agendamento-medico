import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token recebido no link do e-mail' })
  @IsString()
  @IsNotEmpty({ message: 'Token não informado' })
  token: string;

  @ApiProperty({ example: 'novaSenha123', minLength: 8 })
  @IsString()
  @IsNotEmpty({ message: 'Informe a nova senha' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}
