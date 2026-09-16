import { Module } from '@nestjs/common';
import { PrismaModule } from '../../modules-system/prisma/prisma.module.js';
import { CloudinaryModule } from '../../modules-system/cloudinary/cloudinary.module.js';
import { CvController } from './cv.controller.js';
import { CvService } from './cv.service.js';
import { IngestionService } from './services/ingestion.service.js';
import { BaselineParserService } from './services/baseline-parser.service.js';
import { QuestionGeneratorService } from './services/question-generator.service.js';
import { RubricEvaluatorService } from './services/rubric-evaluator.service.js';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [CvController],
  providers: [
    CvService,
    IngestionService,
    BaselineParserService,
    QuestionGeneratorService,
    RubricEvaluatorService,
  ],
  exports: [CvService],
})
export class CvModule {}
