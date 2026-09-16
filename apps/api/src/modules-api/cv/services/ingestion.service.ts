import { Injectable, Logger } from '@nestjs/common';

export interface ExtractedCvData {
  rawText: string;
  fileType: 'pdf' | 'docx' | 'image' | 'unknown';
  pageImages: Buffer[];
  fileBuffer: Buffer;
  mimeType: string;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  async processCvFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<ExtractedCvData> {
    const fileExt = originalName.split('.').pop()?.toLowerCase() || '';
    let rawText = '';
    let fileType: ExtractedCvData['fileType'] = 'unknown';
    const pageImages: Buffer[] = [];
    const resolvedMime =
      mimeType ||
      (fileExt === 'pdf' ? 'application/pdf' : 'application/octet-stream');

    try {
      if (mimeType.includes('pdf') || fileExt === 'pdf') {
        fileType = 'pdf';
        try {
          let pdfParseFn: any;
          try {
            const req = eval('require');
            const imported = req('pdf-parse/lib/pdf-parse.js');
            pdfParseFn =
              typeof imported === 'function'
                ? imported
                : imported.default || imported;
          } catch (rErr) {
            const mod = await import('pdf-parse/lib/pdf-parse.js' as any);
            pdfParseFn =
              typeof mod === 'function' ? mod : mod.default || mod;
          }

          if (typeof pdfParseFn === 'function') {
            try {
              const pdfData = await pdfParseFn(fileBuffer);
              rawText = pdfData?.text || '';
            } catch (cErr) {
              this.logger.warn(
                `pdf-parse execution warning: ${cErr instanceof Error ? cErr.message : String(cErr)}`,
              );
              rawText = '';
            }

            this.logger.log(`pdf-parse extracted ${rawText.length} characters.`);
          }
        } catch (pdfErr) {
          this.logger.warn(
            `pdf-parse module load warning: ${pdfErr instanceof Error ? pdfErr.message : String(pdfErr)}`,
          );
        }

        // Clean extracted text (remove extra spaces and multiple empty lines)
        if (rawText) {
          rawText = rawText
            .replace(/\r\n/g, '\n')
            .replace(/ {2,}/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        }

        // If pdf-parse failed or returned empty text (e.g. image-based PDF), try Gemini Vision OCR fallback
        if (this.isGarbageText(rawText)) {
          this.logger.log(`🤖 Invoking Gemini Vision OCR for scanned PDF ${originalName}...`);
          const geminiText = await this.extractTextViaGemini(fileBuffer, resolvedMime);
          if (geminiText && geminiText.length > 20) {
            rawText = geminiText;
          }
        }

        // Try pdf-img-convert for rendering page 1 to PNG if needed
        try {
          const pdfImgConvert = (await import('pdf-img-convert' as any)) as any;
          const outputImages = await pdfImgConvert.convert(fileBuffer, {
            page_numbers: [1],
            base64_encoded: false,
          });
          if (outputImages && outputImages.length > 0) {
            pageImages.push(Buffer.from(outputImages[0]));
          }
        } catch (imgErr) {
          // Silently fall back if pdf-img-convert native binaries are not available
        }
      } else if (
        mimeType.includes('word') ||
        fileExt === 'docx' ||
        fileExt === 'doc'
      ) {
        fileType = 'docx';
        try {
          let mammothFn: any;
          try {
            const req = eval('require');
            mammothFn = req('mammoth');
          } catch (mErr) {
            const mod = await import('mammoth' as any);
            mammothFn = typeof mod === 'function' ? mod : mod.default || mod;
          }

          const extractFn =
            mammothFn?.extractRawText || mammothFn?.default?.extractRawText;
          if (typeof extractFn === 'function') {
            const result = await extractFn({ buffer: fileBuffer });
            rawText = result.value || '';
            this.logger.log(`mammoth extracted ${rawText.length} characters.`);
          }
        } catch (docxErr) {
          this.logger.warn(
            `mammoth execution error: ${docxErr instanceof Error ? docxErr.message : String(docxErr)}`,
          );
          rawText = '';
        }

        if (this.isGarbageText(rawText)) {
          this.logger.log(`🤖 Invoking Gemini Vision OCR for Word file ${originalName}...`);
          const geminiText = await this.extractTextViaGemini(fileBuffer, resolvedMime);
          if (geminiText && geminiText.length > 20) {
            rawText = geminiText;
          }
        }
      } else if (
        mimeType.includes('image') ||
        ['png', 'jpg', 'jpeg', 'webp'].includes(fileExt)
      ) {
        fileType = 'image';
        pageImages.push(fileBuffer);
        const geminiText = await this.extractTextViaGemini(fileBuffer, resolvedMime);
        rawText = geminiText || `[File ảnh CV: ${originalName}]`;
      } else {
        rawText = fileBuffer.toString('utf-8');
      }
    } catch (error) {
      this.logger.error(
        `Error processing CV file ${originalName}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    rawText = this.sanitizeText(rawText, originalName);

    this.logger.log(
      `📄 Đã trích xuất CV: ${originalName} | Loại file: ${fileType} | Độ dài văn bản: ${rawText.length} ký tự | Số trang ảnh: ${pageImages.length}`,
    );

    return {
      rawText,
      fileType,
      pageImages,
      fileBuffer,
      mimeType: resolvedMime,
    };
  }

  private sanitizeText(raw: string, filename: string): string {
    if (!raw || raw.trim().length === 0) {
      return `[File CV ${filename} - Không thể đọc nội dung văn bản]`;
    }
    return raw.trim();
  }

  private isGarbageText(text: string): boolean {
    if (!text || text.trim().length < 10) return true;
    if (text.startsWith('%PDF-') || text.includes('/FlateDecode')) return true;
    return false;
  }

  private async extractTextViaGemini(
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const apiKey =
      process.env.API_KEY_PART1 ||
      process.env.API_KEY_PART2_CONTENT_1 ||
      process.env.API_KEY_PART2_CONTENT_2 ||
      process.env.API_KEY ||
      '';
    if (!apiKey || apiKey.includes('replace-with')) return '';

    const modelNames = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro',
    ];

    for (const modelName of modelNames) {
      try {
        const googleGenAI = await import('@google/generative-ai' as any);
        const GoogleGenerativeAI = googleGenAI.GoogleGenerativeAI;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const inlinePart = {
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType: mimeType || 'application/pdf',
          },
        };

        const prompt = `Trích xuất toàn bộ văn bản, tên ứng viên, thông tin liên hệ, kinh nghiệm làm việc, dự án, kỹ năng chuyên môn, học vấn và chứng chỉ từ file CV này thành văn bản thuần (plain text) đầy đủ. Trả về đúng 100% nội dung chữ có trong CV.`;

        const response = await model.generateContent([inlinePart, prompt]);
        const resultText = response.response.text();
        if (resultText && resultText.trim().length > 20) {
          return resultText.trim();
        }
      } catch (err) {
        this.logger.warn(
          `Gemini Vision OCR extraction (${modelName}) failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    return '';
  }
}

