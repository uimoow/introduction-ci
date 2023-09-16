import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  public async createProduct(
    createProductDto: CreateProductDTO,
  ): Promise<Product> {
    const result: InsertResult = await this.productRepository.insert(createProductDto)
      .catch((e) => {
        throw new InternalServerErrorException(`[${e.message}]: Failed to create product`,);
      });
    return this.getProduct(result.identifiers[0].id);
  }

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  public async getProduct(productId: number): Promise<Product> {
    const foundProduct: Product = await this.productRepository.findOneBy({ id: productId });
    if (!foundProduct) {
      throw new NotFoundException('Product not found');
    }
    return foundProduct;
  }

  public async updateProduct(
    productId: number,
    updateProductDto: CreateProductDTO,
  ): Promise<Product> {
    const targetProduct = await this.productRepository.findOneBy({ id: productId });
    if (!targetProduct) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.save(updateProductDto);
  }

  public async deleteProduct(productId: number): Promise<DeleteResult> {
    return await this.productRepository.delete(productId)
      .catch((e) => {
        throw new InternalServerErrorException(`[${e.message}]: Failed to delete product`,);
      });
  }
}