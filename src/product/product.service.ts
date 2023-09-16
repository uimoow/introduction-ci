import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  public async getProduct(productId: number): Promise<Product> {
    const foundProduct = await this.productRepository.findOneBy({ id: productId });
    if (!foundProduct) {
      throw new NotFoundException('Product not found');
    }
    return foundProduct;
  }

  public async deleteProduct(productId: number): Promise<void> {
    await this.productRepository.delete(productId);
  }
}