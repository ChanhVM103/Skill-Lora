import { apiClient } from './api-client';
import type { ResourceDifficulty, ResourceType } from '../types/roadmap.types';

export interface ExtendedResource {
  id: string;
  title: string;
  type: ResourceType;
  skill_tags: string[];
  difficulty: ResourceDifficulty;
  url?: string;
  description?: string;
  author?: string;
}

export interface QueryResourceParams {
  search?: string;
  skill_tag?: string;
  difficulty?: string;
  type?: string;
}

export interface CreateResourcePayload {
  title: string;
  type: ResourceType;
  skill_tags: string[];
  difficulty: ResourceDifficulty;
  url?: string;
  description?: string;
  author?: string;
}

export const resourcesService = {
  async getResources(params?: QueryResourceParams): Promise<ExtendedResource[]> {
    const cleanParams: Record<string, string> = {};
    if (params?.search) cleanParams.search = params.search;
    if (params?.skill_tag && params.skill_tag !== 'all') cleanParams.skill_tag = params.skill_tag;
    if (params?.difficulty && params.difficulty !== 'all') cleanParams.difficulty = params.difficulty;
    if (params?.type && params.type !== 'all') cleanParams.type = params.type;

    const response = await apiClient.get<ExtendedResource[]>('/resources', {
      params: cleanParams,
    });
    return response.data;
  },

  async createResource(payload: CreateResourcePayload): Promise<ExtendedResource> {
    const response = await apiClient.post<ExtendedResource>('/resources', payload);
    return response.data;
  },
};
