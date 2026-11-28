import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service.js';
import { QueryExamDto } from './dto/query-exam.dto.js';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista os exames, com busca opcional pelo nome',
    description:
      'Sem "search", retorna todos. Com "search", ignora acentos, maiúsculas e hífen, e exige que todas as palavras apareçam no nome (em qualquer ordem).',
  })
  @ApiBadRequestResponse({ description: 'Busca inválida (ex.: muito longa)' })
  findAll(@Query() { search }: QueryExamDto) {
    return this.examsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um exame pelo id' })
  @ApiBadRequestResponse({ description: 'O id não é um número' })
  @ApiNotFoundResponse({ description: 'Exame não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.findOne(id);
  }
}
