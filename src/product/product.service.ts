import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  public async createProduct(
    createProductDto: CreateProductDTO,
  ): Promise<Product> {
    const { name, description, price } = createProductDto;
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;

    const result: InsertResult = await this.productRepository.insert(product)
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
    const { name, description, price } = updateProductDto;
    targetProduct.name = name;
    targetProduct.description = description;
    targetProduct.price = price;
    return this.productRepository.save(targetProduct);
  }

  public async deleteProduct(productId: number): Promise<DeleteResult> {
    return await this.productRepository.delete(productId)
      .catch((e) => {
        throw new InternalServerErrorException(`[${e.message}]: Failed to delete product`,);
      });
  }
}