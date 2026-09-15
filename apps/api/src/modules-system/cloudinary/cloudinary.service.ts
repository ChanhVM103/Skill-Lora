import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: any,
    folder: string = 'skillora/avatars',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Vui lòng chọn một file hợp lệ');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      const stream = (streamifier as any).createReadStream
        ? (streamifier as any).createReadStream(file.buffer)
        : (streamifier as any)(file.buffer);

      stream.pipe(uploadStream);
    });
  }
}
