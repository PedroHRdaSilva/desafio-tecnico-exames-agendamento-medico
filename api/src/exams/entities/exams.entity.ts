import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ collection: 'exams', timestamps: true, versionKey: false })
export class Exam {
  @Prop({ type: Number, required: true, min: 1 })
  _id: number;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, select: false })
  searchName: string;

  @Prop({ required: true, min: 1 })
  durationMinutes: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
