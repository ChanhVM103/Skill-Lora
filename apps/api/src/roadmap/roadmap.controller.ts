import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateRoadmapRequestDto } from './dto/generate-roadmap-request.dto.js';
import { RoadmapResponseDto } from './dto/roadmap-response.dto.js';
import { RoadmapService } from './roadmap.service.js';

@ApiTags('Roadmaps')
@Controller('roadmaps')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a deterministic learning roadmap from skill gaps',
    description:
      'Scores improvement needs with backend rules, optionally asks Gemini to generate a 4-week lesson plan, and falls back to backend templates if AI is unavailable.',
  })
  @ApiBody({ type: GenerateRoadmapRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Roadmap generated successfully.',
    type: RoadmapResponseDto,
  })
  async generateRoadmap(
    @Body() request: GenerateRoadmapRequestDto,
  ): Promise<RoadmapResponseDto> {
    return this.roadmapService.generateRoadmap(request);
  }
}