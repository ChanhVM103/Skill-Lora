import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { TargetRole } from '../roadmap/dto/generate-roadmap-request.dto.js';
import { AnalyzeRequestDto } from './dto/analyze-request.dto.js';
import { AnalysisResponseDto } from './dto/analysis-response.dto.js';
import { AnalysisService } from './analysis.service.js';

@ApiTags('Student Analysis Flow')
@Controller('analyses')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  @Public()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv_file', maxCount: 1 },
      { name: 'transcript_file', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Tải lên CV & Bảng điểm để phân tích khoảng trống kỹ năng',
    description:
      'Chạy pipeline deterministic-first: trích xuất kỹ năng, so khớp chuẩn nghề nghiệp, tính điểm sẵn sàng và sinh danh sách gap.',
  })
  @ApiBody({ type: AnalyzeRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Kết quả phân tích độ sẵn sàng và khoảng trống kỹ năng.',
    type: AnalysisResponseDto,
  })
  async analyze(
    @UploadedFiles()
    files: {
      cv_file?: any[];
      transcript_file?: any[];
    },
    @Body() body: any,
  ): Promise<AnalysisResponseDto> {
    const cvFile = files?.cv_file?.[0];
    if (!cvFile) {
      throw new BadRequestException('Trường cv_file là bắt buộc (file PDF hoặc DOCX)');
    }

    const targetRole = (body?.target_role as TargetRole) || TargetRole.BackendDeveloper;
    const transcriptFile = files?.transcript_file?.[0];
    const jdText = body?.jd_text;

    return this.analysisService.analyze(targetRole, cvFile, transcriptFile, jdText);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết kết quả phân tích theo ID' })
  @ApiResponse({ status: 200, type: AnalysisResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy kết quả phân tích.' })
  async findOne(@Param('id') id: string): Promise<AnalysisResponseDto> {
    return this.analysisService.findById(id);
  }
}
