import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryExamDto {
  @ApiPropertyOptional({
    example: 'raio x',
    description: 'Parte do nome do exame (ignora acentos, maiúsculas e hífen)',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A busca deve ser um texto' })
  @MaxLength(100, { message: 'A busca deve ter no máximo 100 caracteres' })
  search?: string;
}
