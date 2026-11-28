import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from './entities/exams.entity.js';
import { toSearchTerms } from './utils/normalize-search.js';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
  ) {}

  async findAll(search?: string): Promise<ExamDocument[]> {
    const terms = search ? toSearchTerms(search) : [];

    const filter = terms.length
      ? { $and: terms.map((term) => ({ searchName: { $regex: term } })) }
      : {};

    return this.examModel.find(filter).sort({ searchName: 1 });
  }

  async findOne(id: number): Promise<ExamDocument> {
    const exam = await this.examModel.findById(id);

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    return exam;
  }
}
