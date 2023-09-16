import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './product.entity';
import { DeleteResult, InsertResult } from 'typeorm';
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Post('create')
  public async createProduct(
    @Body() createProductDto: CreateProductDTO,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductDto);
  }

  @Get('all')
  public async getProducts(): Promise<Product[]> {
    return await this.productService.getProducts();
  }

  @Get('/:productId')
  public async getProduct(@Param('productId') productId: number
  ): Promise<Product> {
    return await this.productService.getProduct(productId);
  }

  @Patch('/update/:productId')
  public async editProduct(
    @Body() updateProductDto: CreateProductDTO,
    @Param('productId') productId: number,
  ): Promise<Product> {
    const product = await this.productService.updateProduct(
      productId,
      updateProductDto,
    );
    return product;
  }

  @Delete('/delete/:productId')
  public async deleteProduct(@Param('productId') productId: number
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }
}