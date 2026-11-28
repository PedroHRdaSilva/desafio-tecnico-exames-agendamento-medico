import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './entities/exams.entity.js';
import { ExamsService } from './exams.service.js';
import { ExamsController } from './exams.controller.js';
import { ExamsSeed } from './seed/exams.seed.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService, ExamsSeed],

  exports: [ExamsService],
})
export class ExamsModule {}
