import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fileFilter, fileNamer } from './helpers';
import { FileUploadDto } from './dto/FileUpload.dto';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) { }

    @Post('upload')
    @ApiOperation({ summary: 'Upload a product image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File upload',
        type: FileUploadDto,
    })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'No file uploaded or file type not supported' })
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
    @ApiOperation({ summary: 'Upload an image for OCR processing' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload a file for OCR',
        type: FileUploadDto,
    })
    @ApiResponse({ status: 201, description: 'OCR processing successful' })
    @ApiResponse({ status: 400, description: 'No file uploaded or error during processing' })
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




