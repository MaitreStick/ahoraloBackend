import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Res, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService,
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { fileFilter }))
    async uploadProductImage(
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded or file type not supported');
        }
        return this.filesService.uploadImage(file);
    }

    @Post('uploadOcrImage')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './static/ocr-images', 
            filename: fileNamer, 
        }),
        fileFilter: fileFilter,
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('comcity') comcity: string,
    ): Promise<{ company: string, products: { code: string, price: string }[], text: string }> {
        if (!file || !file.path) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const ocrResults = await this.filesService.processImage(file.path, comcity);
        
            await this.filesService.deleteFile(file.path);
        
            return ocrResults;
          } catch (error) {
            console.error('Error processing image:', error);
        
            await this.filesService.deleteFile(file.path);
        
            throw new BadRequestException('Error processing image');
          }
    }

}




