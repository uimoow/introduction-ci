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
    return await this.productRepository.find().catch((e) => {
      throw new NotFoundException(e.message);
    });
  }
}