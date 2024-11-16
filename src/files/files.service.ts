import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ProdcomcityService } from 'src/prodcomcity/prodcomcity.service';
import { ProductsService } from 'src/products/products.service';
import { productCodes } from 'src/seed/helpers/specialAssignments';
import * as streamifier from 'streamifier';
import { promises as fsPromises } from 'fs';
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');

@Injectable()
export class FilesService {

  private readonly productCodes = productCodes;

  constructor(
    private readonly prodcomcityService: ProdcomcityService,
    private readonly productsService: ProductsService,
  ) { }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<string | PromiseLike<string | UploadApiResponse>> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 300, height: 300, crop: 'fill', gravity: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new InternalServerErrorException('Failed to upload image to Cloudinary'));
          }
          console.log(result);
          // resolve(result.secure_url);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private async resizeSmallImage(imageBuffer: Buffer): Promise<Buffer> {
    const metadata = await sharp(imageBuffer).metadata();
    if (metadata.width < 100 || metadata.height < 100) {
      console.log("La imagen es pequeña, escalando...");
      return sharp(imageBuffer)
        .resize({ width: 300, height: 300, fit: 'contain' })
        .toBuffer();
    }
    return imageBuffer;
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer)
      .toColourspace('b-w')
      .toBuffer();
  }

  private async correctRotation(imageBuffer: Buffer): Promise<Buffer> {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const { orientation } = metadata;
  
      if (!orientation || orientation === 1) return imageBuffer;
  
      return sharp(imageBuffer).rotate().toBuffer();
    } catch (error) {
      console.error('Error in correctRotation:', error);
      return imageBuffer;
    }
  }
  

  private async convertToBase64(imageBuffer: Buffer): Promise<string> {
    const base64 = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }


  async processImage(filePath: string, comcityId: string): Promise<{ company: string, products: any[], text: string }> {
    try {
      const imageBuffer = await fsPromises.readFile(filePath);

      await this.resizeSmallImage(imageBuffer);

      let correctedImageBuffer = await this.correctRotation(imageBuffer);
      let preprocessedImageBuffer = await this.preprocessImage(correctedImageBuffer);
      let base64Image = await this.convertToBase64(preprocessedImageBuffer);

      const worker = await createWorker('spa');
      console.log("Worker created");

      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
      });
      const { data: { text } } = await worker.recognize(base64Image);
      console.log("Text recognized");

      await worker.terminate();
      console.log("Worker terminated");

      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const products = this.extractProductsFromText(lines);

      const currentDate = new Date();

      for (const product of products) {
        try {
          const detailedProduct = await this.productsService.findProductsByCode(product.code);
          const prodcomcity = await this.prodcomcityService.findProdcomcityByComcityAndProduct(comcityId, detailedProduct.id);

          if (prodcomcity) {
            const updateProdcomcityDto = {
              comcity: comcityId,
              product: detailedProduct.id,
              date: currentDate,
              price: parseFloat(product.price)
            };
            await this.prodcomcityService.updateProdcomcityOcr(prodcomcity.id, updateProdcomcityDto);
          }

          console.log(`Updated prodcomcity ${prodcomcity.id} for product code ${product.code}`);
        } catch (error) {
          console.error(`Error updating prodcomcity for product code ${product.code}: ${error.message}`);
        }
      }

      return {
        company: this.getCompanyFromCodes(products.map(p => p.code)),
        products: products.map(p => ({ code: p.code, price: p.price })),
        text
      };

    } catch (error) {
      console.error('Error processing image:', error);
      throw new InternalServerErrorException('Error processing image');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fsPromises.unlink(filePath);
      console.log(`File ${filePath} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  private extractProductsFromText(lines: string[]): { code: string, price: string }[] {
    const products = [];
    const regex = /(\d{4,14})\s*(\d+(\.\d+)?)/g;

    for (const line of lines) {
      let match;
      while ((match = regex.exec(line)) !== null) {
        let code = match[1];
        let rawPrice = match[2];
        if (this.isValidCode(code)) {
          let price = this.adjustPrice(rawPrice);
          if (this.isValidPrice(price)) {
            products.push({ code, price });
          }
        }
      }
    }
    return products;
  }


  private isValidPrice(price: string): boolean {
    const numPrice = parseFloat(price);
    return numPrice >= 100 && numPrice < 50000;
  }

  private adjustPrice(price: string): string {
    let numPrice = parseFloat(price);
    if (numPrice > 50000) {
      while (numPrice > 50000 && price.length > 0) {
        price = price.slice(0, -1);
        numPrice = parseFloat(price);
      }
    }
    return numPrice.toFixed(0);
  }

  private isValidCode(code: string): boolean {
    return Object.values(this.productCodes).flat().includes(code);
  }

  private getCompanyFromCodes(codes: string[]): string {
    for (const [company, productCodes] of Object.entries(this.productCodes)) {
      if (codes.some(code => productCodes.includes(code))) {
        return company;
      }
    }
    return 'Desconocida';
  }

}