import {
    Controller,
    Get,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { Product } from './product.entity';
  
  @Controller('product')
  export class ProductController {
    constructor(private productService: ProductService) {}
  
    @Get('all')
    public async getProducts(): Promise<Product[]> {
      const products = await this.productService.getProducts();
      return products;
    }
}