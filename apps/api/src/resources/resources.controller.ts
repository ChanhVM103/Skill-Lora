import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { QueryResourceDto } from './dto/query-resource.dto.js';
import { ResourceResponseDto } from './dto/resource-response.dto.js';
import { ResourcesService } from './resources.service.js';

@ApiTags('Teacher Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Lấy danh sách tài nguyên học tập của giảng viên',
    description:
      'Hỗ trợ tìm kiếm theo từ khóa và lọc theo skill_tag, difficulty, type.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tài nguyên học tập phù hợp.',
    type: [ResourceResponseDto],
  })
  async findAll(@Query() query: QueryResourceDto): Promise<ResourceResponseDto[]> {
    return this.resourcesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết một tài nguyên học tập theo ID' })
  @ApiResponse({ status: 200, type: ResourceResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tài nguyên.' })
  async findOne(@Param('id') id: string): Promise<ResourceResponseDto> {
    const resource = await this.resourcesService.findById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID '${id}' not found`);
    }
    return resource;
  }

  @Post()
  @Public() // Cho phép demo ở MVP, hoặc có thể bảo vệ qua ProtectGuard
  @ApiOperation({
    summary: 'Giảng viên đóng góp / tạo tài nguyên học tập mới',
    description:
      'Thêm bài giảng, video, assignment, đồ án mẫu hoặc trắc nghiệm vào kho tài nguyên.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tài nguyên đã được tạo thành công.',
    type: ResourceResponseDto,
  })
  async create(@Body() body: CreateResourceDto): Promise<ResourceResponseDto> {
    return this.resourcesService.create(body);
  }
}
