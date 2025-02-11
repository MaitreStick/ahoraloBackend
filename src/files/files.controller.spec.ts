import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;

  // Mock del FileService
  const mockFilesService = {
    uploadImage: jest.fn(),
    processImage: jest.fn(),
    deleteFile: jest.fn(),
  };

  // Mock de un archivo
  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: './static/products',
    filename: 'test-123.jpg',
    path: './static/products/test-123.jpg',
    size: 12345,
    buffer: Buffer.from('test'),
    stream: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
  });

  describe('uploadProductImage', () => {
    it('should upload an image successfully', async () => {
      const expectedResponse = { secureUrl: 'https://example.com/image.jpg' };
      mockFilesService.uploadImage.mockResolvedValue(expectedResponse);

      const result = await controller.uploadProductImage(mockFile);

      expect(result).toEqual(expectedResponse);
      expect(filesService.uploadImage).toHaveBeenCalledWith(mockFile);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(controller.uploadProductImage(null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadFile (OCR)', () => {
    const mockOcrResponse = {
      company: 'Test Company',
      products: [{ code: '123', price: '10.99' }],
      text: 'Sample OCR text',
    };

    const mockComcity = 'test-comcity-id';

    beforeEach(() => {
      mockFilesService.processImage.mockReset();
      mockFilesService.deleteFile.mockReset();
    });

    it('should process image and return OCR results', async () => {
      mockFilesService.processImage.mockResolvedValue(mockOcrResponse);
      mockFilesService.deleteFile.mockResolvedValue(undefined);

      const result = await controller.uploadFile(mockFile, mockComcity);

      expect(result).toEqual(mockOcrResponse);
      expect(filesService.processImage).toHaveBeenCalledWith(
        mockFile.path,
        mockComcity,
      );
      expect(filesService.deleteFile).toHaveBeenCalledWith(mockFile.path);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(controller.uploadFile(null, mockComcity)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle errors during image processing', async () => {
      mockFilesService.processImage.mockRejectedValue(new Error('Processing error'));
      mockFilesService.deleteFile.mockResolvedValue(undefined);

      await expect(controller.uploadFile(mockFile, mockComcity)).rejects.toThrow(
        BadRequestException,
      );

      expect(filesService.deleteFile).toHaveBeenCalledWith(mockFile.path);
    });

    it('should handle file deletion after processing', async () => {
      mockFilesService.processImage.mockResolvedValue(mockOcrResponse);
      mockFilesService.deleteFile.mockResolvedValue(undefined);

      await controller.uploadFile(mockFile, mockComcity);

      expect(filesService.deleteFile).toHaveBeenCalledWith(mockFile.path);
    });
  });

  describe('Swagger Decorators', () => {
    it('should have proper Swagger decorators', () => {
      const controllerMetadata = Reflect.getMetadata(
        'swagger/apiTags',
        FilesController,
      );
      expect(controllerMetadata).toEqual(['Files - Get and Upload']);

      const uploadMethodMetadata = Reflect.getMetadata(
        'swagger/apiOperation',
        controller.uploadProductImage,
      );
      expect(uploadMethodMetadata).toBeDefined();
    });
  });
});