import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Model } from 'mongoose';
import { Exam } from '../entities/exams.entity.js';
import { toSearchName } from '../utils/normalize-search.js';
import { parseExamsCsv } from './parse-exams-csv.js';

@Injectable()
export class ExamsSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(ExamsSeed.name);

  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const csvPath = resolve(
      this.config.get<string>('EXAMS_CSV_PATH') ?? '../dados/exames.csv',
    );

    let content: string;
    try {
      content = await readFile(csvPath, 'utf-8');
    } catch {
      throw new Error(
        `Não foi possível ler o catálogo de exames em "${csvPath}". ` +
          'Confira se a pasta dados/ está na raiz do projeto ou defina EXAMS_CSV_PATH.',
      );
    }

    const exams = parseExamsCsv(content);

    await this.examModel.bulkWrite(
      exams.map((exam) => ({
        updateOne: {
          filter: { _id: exam.id },
          update: {
            $set: {
              name: exam.name,
              searchName: toSearchName(exam.name),
              durationMinutes: exam.durationMinutes,
            },
          },
          upsert: true,
        },
      })),
    );

    this.logger.log(
      `${exams.length} exames sincronizados a partir de ${csvPath}`,
    );
  }
}
