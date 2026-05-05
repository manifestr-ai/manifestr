import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

/**
 * Service to extract text from various document types
 * Supports: .txt, .doc, .docx, .pdf
 */
export class DocumentTextExtractor {
  /**
   * Extract text from a document file
   * @param filePath - Path to the file or file buffer
   * @param mimeType - MIME type of the file
   * @returns Extracted text content
   */
  async extractText(fileBuffer: Buffer, mimeType: string, originalName: string): Promise<string> {
    console.log(`📄 Extracting text from file: ${originalName} (${mimeType})`);

    try {
      // Handle .txt files
      if (mimeType === 'text/plain' || originalName.endsWith('.txt')) {
        const text = fileBuffer.toString('utf-8');
        console.log(`✅ Extracted ${text.length} characters from .txt file`);
        console.log('📝 Extracted text preview (first 500 chars):');
        console.log('─'.repeat(80));
        console.log(text.substring(0, 500));
        console.log('─'.repeat(80));
        return text.trim();
      }

      // Handle .pdf files
      if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
        return await this.extractPdfText(fileBuffer);
      }

      // Handle .doc files (legacy Word format)
      if (
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.ms-word' ||
        originalName.endsWith('.doc')
      ) {
        return await this.extractDocText(fileBuffer);
      }

      // Handle .docx files (modern Word format)
      if (
        mimeType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        originalName.endsWith('.docx')
      ) {
        return await this.extractDocxText(fileBuffer);
      }

      throw new Error(
        `Unsupported file type: ${mimeType}. Please upload .txt, .doc, .docx, or .pdf files.`
      );
    } catch (error) {
      console.error('❌ Text extraction failed:', error);
      throw new Error(
        `Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Extract text from PDF file using pdf.js-extract (Mozilla's PDF.js)
   */
  private async extractPdfText(buffer: Buffer): Promise<string> {
    try {
      // Use pdf.js-extract - more reliable than pdf-parse
      const PDFExtract = require('pdf.js-extract').PDFExtract;
      const pdfExtract = new PDFExtract();
      
      // Extract text from buffer
      const data = await pdfExtract.extractBuffer(buffer, {});
      
      // Combine all text from all pages
      let text = '';
      for (const page of data.pages) {
        for (const item of page.content) {
          if (item.str) {
            text += item.str + ' ';
          }
        }
        text += '\n'; // Add newline between pages
      }
      
      text = text.trim();
      console.log(`✅ Extracted ${text.length} characters from PDF (${data.pages.length} pages)`);
      console.log('📝 Extracted text preview (first 500 chars):');
      console.log('─'.repeat(80));
      console.log(text.substring(0, 500));
      console.log('─'.repeat(80));
      return text;
    } catch (error) {
      console.error('❌ PDF extraction failed:', error);
      throw new Error(
        'Failed to extract text from PDF. Please ensure the file is not corrupted or password-protected.'
      );
    }
  }

  /**
   * Extract text from .docx file
   */
  private async extractDocxText(buffer: Buffer): Promise<string> {
    try {
      // Use mammoth library to extract text from .docx
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      console.log(`✅ Extracted ${text.length} characters from .docx file`);
      console.log('📝 Extracted text preview (first 500 chars):');
      console.log('─'.repeat(80));
      console.log(text.substring(0, 500));
      console.log('─'.repeat(80));
      return text;
    } catch (error) {
      console.error('❌ DOCX extraction failed:', error);
      throw new Error(
        'Failed to extract text from .docx file. Please ensure the file is not corrupted.'
      );
    }
  }

  /**
   * Extract text from legacy .doc file
   */
  private async extractDocText(buffer: Buffer): Promise<string> {
    try {
      // Use antiword or textract for legacy .doc format
      // For now, try to convert to string (basic approach)
      // Note: This is a simplified approach and may not work perfectly for all .doc files
      
      // Try using textract if available
      try {
        const textract = require('textract');
        return new Promise((resolve, reject) => {
          textract.fromBufferWithMime(
            'application/msword',
            buffer,
            (error: any, text: string) => {
              if (error) {
                reject(error);
              } else {
                console.log(`✅ Extracted ${text.length} characters from .doc file`);
                console.log('📝 Extracted text preview (first 500 chars):');
                console.log('─'.repeat(80));
                console.log(text.substring(0, 500));
                console.log('─'.repeat(80));
                resolve(text.trim());
              }
            }
          );
        });
      } catch (textractError) {
        // Fallback: try to extract text using word-extractor
        const WordExtractor = require('word-extractor');
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(buffer);
        const text = extracted.getBody().trim();
        console.log(`✅ Extracted ${text.length} characters from .doc file (fallback)`);
        console.log('📝 Extracted text preview (first 500 chars):');
        console.log('─'.repeat(80));
        console.log(text.substring(0, 500));
        console.log('─'.repeat(80));
        return text;
      }
    } catch (error) {
      console.error('❌ DOC extraction failed:', error);
      throw new Error(
        'Failed to extract text from .doc file. Consider converting to .docx or .txt format.'
      );
    }
  }
}

export default new DocumentTextExtractor();
