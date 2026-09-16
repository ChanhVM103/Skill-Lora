import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ProtectGuard } from '../../common/guards/protect.guard.js';
import { CvService } from './cv.service.js';
import { CreateBaselineDto } from './dto/create-baseline.dto.js';
import { SubmitAnswersDto } from './dto/submit-answers.dto.js';
import {
  BaselineResponseDto,
  EvaluationResponseDto,
} from './dto/cv-assessment-response.dto.js';

@ApiTags('CV Engineering Assessment')
@ApiBearerAuth()
@UseGuards(ProtectGuard)
@Controller()
export class CvController {
  constructor(private readonly cvService: CvService) {}

  /**
   * Endpoint Lượt gọi 1 (Call 1): POST /analyses/baseline
   */
  @ApiOperation({
    summary: 'Bước 1 & 2: Parse Baseline CV & Sinh Bộ câu hỏi Phỏng vấn Động theo Target Role',
    description:
      'Yêu cầu Access Token (Bearer Token). Nhận file CV và Vị trí mục tiêu (target_role ví dụ: frontend_reactjs, backend_nestjs), parse dữ liệu Baseline (dự án, tính năng, điểm cộng ngoại ngữ & chứng chỉ), đồng thời tự động sinh 4-8 câu hỏi phỏng vấn theo 4 trục (Technology, System, People, Process).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Thành công, trả về session_id, Baseline và Danh sách Câu hỏi Phỏng vấn.',
    type: BaselineResponseDto,
  })
  @Post('analyses/baseline')
  @UseInterceptors(FileInterceptor('cv_file'))
  async createBaseline(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() dto: CreateBaselineDto,
  ): Promise<BaselineResponseDto> {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (cv_file)');
    }
    const userId = (req as any).user?.id;
    return this.cvService.createBaselineAndQuestions(file, dto, userId);
  }

  /**
   * Endpoint Lượt gọi 2 (Call 2): POST /analyses/:id/submit-answers
   */
  @ApiOperation({
    summary: 'Bước 3 & 4: Nộp Câu trả lời Phỏng vấn & Chấm điểm Rubric L1->L5',
    description:
      'Yêu cầu Access Token (Bearer Token). Nhận mảng câu trả lời của ứng viên cho bộ câu hỏi ở Bước 2. Backend tự động query DB lấy Raw CV Text, ghép cặp câu hỏi-đáp án và gọi AI đối soát chấm điểm Rubric L1->L5, sau đó trả về Bản thiết kế Lộ trình Nâng Level (Level-Up Blueprint) chuyên biệt theo Target Role.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của phiên phỏng vấn (session_id nhận được từ Call 1)',
    example: '65fc7a12b3e4f9810a123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công, trả về kết quả Chấm điểm 4 Trục và Lộ trình Nâng Level.',
    type: EvaluationResponseDto,
  })
  @Post('analyses/:id/submit-answers')
  async submitAnswers(
    @Param('id') id: string,
    @Body() dto: SubmitAnswersDto,
  ): Promise<EvaluationResponseDto> {
    return this.cvService.submitAnswersAndEvaluate(id, dto);
  }

  /**
   * Priority / Legacy Endpoint Wrapper: POST /analyses
   */
  @ApiOperation({
    summary: 'Khởi tạo Đánh giá CV (Call 1 Wrapper)',
    description: 'Endpoint tương thích nhận file CV và target_role, thực hiện Call 1.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    type: BaselineResponseDto,
  })
  @Post('analyses')
  @UseInterceptors(FileInterceptor('cv_file'))
  async analyzeCv(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() dto: CreateBaselineDto,
  ): Promise<BaselineResponseDto> {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (cv_file)');
    }
    const userId = (req as any).user?.id;
    return this.cvService.createBaselineAndQuestions(file, dto, userId);
  }

  /**
   * Alias Endpoint: POST /cv/analyze
   */
  @ApiOperation({ summary: 'Phân tích CV (Alias Endpoint)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: BaselineResponseDto })
  @Post('cv/analyze')
  @UseInterceptors(FileInterceptor('cv_file'))
  async analyzeCvAlias(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() dto: CreateBaselineDto,
  ): Promise<BaselineResponseDto> {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (cv_file)');
    }
    const userId = (req as any).user?.id;
    return this.cvService.createBaselineAndQuestions(file, dto, userId);
  }

  /**
   * Endpoint: GET /cv/history & GET /analyses/history
   */
  @ApiOperation({ summary: 'Lấy danh sách lịch sử phiên phân tích CV của người dùng hiện tại' })
  @Get('cv/history')
  async getCvHistory(@Req() req: Request, @Query('userId') queryUserId?: string) {
    const userId = (req as any).user?.id || queryUserId;
    if (!userId) {
      return [];
    }
    return this.cvService.getUserCvHistory(userId);
  }

  @Get('analyses/history')
  async getAnalysesHistory(@Req() req: Request, @Query('userId') queryUserId?: string) {
    const userId = (req as any).user?.id || queryUserId;
    if (!userId) {
      return [];
    }
    return this.cvService.getUserCvHistory(userId);
  }

  /**
   * Endpoint: GET /cv/history/:id & GET /analyses/:id
   */
  @ApiOperation({ summary: 'Lấy chi tiết phiên phân tích CV theo ID' })
  @Get('cv/history/:id')
  async getCvAnalysisById(@Param('id') id: string) {
    return this.cvService.getCvAnalysisById(id);
  }

  @Get('analyses/:id')
  async getAnalysisById(@Param('id') id: string) {
    return this.cvService.getCvAnalysisById(id);
  }

  /**
   * Endpoint: DELETE /analyses/:id & DELETE /cv/history/:id
   */
  @ApiOperation({ summary: 'Xóa một phiên phân tích CV theo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID của phiên phân tích CV (session_id)',
    example: '65fc7a12b3e4f9810a123456',
  })
  @Delete('analyses/:id')
  async deleteAnalysisById(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id;
    return this.cvService.deleteCvAnalysisById(id, userId);
  }

  @Delete('cv/history/:id')
  async deleteCvHistoryById(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id;
    return this.cvService.deleteCvAnalysisById(id, userId);
  }
}
