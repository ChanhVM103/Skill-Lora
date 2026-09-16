import 'dotenv/config';

export const PORT = process.env.PORT;

export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_REDIS = process.env.DATABASE_REDIS;

export const API_KEY_PRIMARY = process.env.API_KEY_PRIMARY || process.env.API_KEY_PART1 || process.env.API_KEY;
export const API_KEY_BACKUP_1 = process.env.API_KEY_BACKUP_1 || process.env.API_KEY_PART2_CONTENT_1;
export const API_KEY_BACKUP_2 = process.env.API_KEY_BACKUP_2 || process.env.API_KEY_PART2_CONTENT_2;

export const API_KEY = API_KEY_PRIMARY;
export const API_KEY_PART1 = API_KEY_PRIMARY;
export const API_KEY_PART2_CONTENT_1 = API_KEY_BACKUP_1;
export const API_KEY_PART2_CONTENT_2 = API_KEY_BACKUP_2;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRECT = process.env.CLOUDINARY_API_SECRECT;

/**
 * Lấy danh sách tất cả các Gemini API Key khả dụng từ .env (API_KEY_PRIMARY, API_KEY_BACKUP_1, API_KEY_BACKUP_2)
 */
export function getAvailableApiKeys(): string[] {
  const rawKeys = [
    API_KEY_PRIMARY,
    API_KEY_BACKUP_1,
    API_KEY_BACKUP_2,
    process.env.API_KEY_PRIMARY,
    process.env.API_KEY_PART1,
    process.env.API_KEY_BACKUP_1,
    process.env.API_KEY_PART2_CONTENT_1,
    process.env.API_KEY_BACKUP_2,
    process.env.API_KEY_PART2_CONTENT_2,
    process.env.API_KEY,
  ];

  const validKeys = rawKeys.filter(
    (k): k is string =>
      typeof k === 'string' &&
      k.trim().length > 0 &&
      !k.includes('replace-with'),
  );

  return Array.from(new Set(validKeys));
}

console.log(
  '\n Available Gemini API Keys Loaded:',
  getAvailableApiKeys().length,
  '\n',
);
