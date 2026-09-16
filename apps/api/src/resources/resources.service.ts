import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { QueryResourceDto } from './dto/query-resource.dto.js';
import { ResourceResponseDto } from './dto/resource-response.dto.js';
import { SEED_RESOURCES } from './config/seed-resources.config.js';

@Injectable()
export class ResourcesService {
  private resources: ResourceResponseDto[] = [...SEED_RESOURCES];

  async findAll(query?: QueryResourceDto): Promise<ResourceResponseDto[]> {
    let result = [...this.resources];

    if (!query) return result;

    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.skill_tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (query.skill_tag) {
      const tag = query.skill_tag.toLowerCase();
      result = result.filter((r) =>
        r.skill_tags.some((t) => t.toLowerCase() === tag),
      );
    }

    if (query.difficulty) {
      result = result.filter((r) => r.difficulty === query.difficulty);
    }

    if (query.type) {
      result = result.filter((r) => r.type === query.type);
    }

    return result;
  }

  async findById(id: string): Promise<ResourceResponseDto | null> {
    const item = this.resources.find((r) => r.id === id);
    return item || null;
  }

  async create(dto: CreateResourceDto): Promise<ResourceResponseDto> {
    const newResource: ResourceResponseDto = {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: dto.title,
      type: dto.type,
      skill_tags: dto.skill_tags,
      difficulty: dto.difficulty,
      url: dto.url,
      description: dto.description,
      author: dto.author || 'Giảng viên đóng góp',
      created_at: new Date().toISOString(),
    };

    this.resources.unshift(newResource);
    return newResource;
  }

  async findMatchingForSkills(skillTags: string[]): Promise<ResourceResponseDto[]> {
    const lowerTags = skillTags.map((t) => t.toLowerCase());
    return this.resources.filter((r) =>
      r.skill_tags.some((t) => lowerTags.includes(t.toLowerCase())),
    );
  }
}
