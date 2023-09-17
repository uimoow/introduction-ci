import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useClass: Repository },
      ],
    }).compile();

    mockRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    service = module.get<ProductService>(ProductService);
  });

  describe("createProduct()", () => {
    it("データ登録に成功すること", () => {
      const dto: CreateProductDTO = {
        name: "Mango",
        description: "test",
        price: "220",
      };

      const product: Product = new Product();
      product.id = 1;
      product.name = dto.name;
      product.description = dto.description;
      product.price = dto.price;

      jest
        .spyOn(mockRepository, "insert")
        .mockImplementation(async () => {
          const result: InsertResult = new InsertResult();
          result.identifiers[0] = product;
          return result;
        });

      jest
        .spyOn(mockRepository, "findOneBy")
        .mockImplementation(async () => {
          return product;
        });

      expect(service.createProduct(dto)).resolves.toEqual(product);
    });
  });

  describe("deleteProduct()", () => {
    it("データ登録に失敗した場合、InternalServerErrorExceptionがthrowされること", () => {
      const dto: CreateProductDTO = {
        name: "Mango",
        description: "test",
        price: "220",
      };
      const msg: string = "Password has expired";

      jest
        .spyOn(mockRepository, "insert")
        .mockRejectedValue(new UnauthorizedException(msg));

      expect(service.createProduct(dto)).rejects.toEqual(
        new InternalServerErrorException(`[${msg}]: Failed to create product`,)
      );
    });
  });

  describe("getProducts()", () => {
    it("データが1件もない場合、空の配列を返却すること", () => {
      jest
        .spyOn(mockRepository, "find")
        .mockImplementation(async () => {
          return [];
        });

      expect(service.getProducts()).resolves.toEqual([]);
    });
  });

  describe("getProducts()", () => {
    it("全データ取得に成功すること", () => {
      let product: Product;
      const products: Product[] = [];

      for (let i:number = 1; i<=5; i++) {
        product = new Product();
        product.id = i;
        product.name = "name" + i;
        product.description = "description" + i;
        product.price = String(100 + i);
        products[i-1] = product;
      }

      jest
        .spyOn(mockRepository, "find")
        .mockImplementation(async () => {
          return products;
        });

      expect(service.getProducts()).resolves.toEqual(products);
    });
  });

  describe("getProduct()", () => {
    it("データ取得に成功すること", () => {
      const productId: number = 1;
      const product: Product = new Product();
      product.id = productId;
      product.name = "testName";
      product.description = "testDescripition";
      product.price = "100000";

      jest
        .spyOn(mockRepository, "findOneBy")
        .mockImplementation(async () => {
          return product;
        });

      expect(service.getProduct(productId)).resolves.toEqual(product);
    });
  });

  describe("getProduct()", () => {
    it("取得対象データがない場合、NotFoundExceotionをthrowすること", () => {
      const productId: number = 1;

      jest
        .spyOn(mockRepository, "findOneBy")
        .mockImplementation(async () => {
          return null;
        });

      expect(service.getProduct(productId)).rejects.toEqual(
        new NotFoundException('Product not found')
      );
    });
  });

  describe("updateProduct()", () => {
    it("データ更新に成功すること", () => {
      const productId: number = 1;
      const dto: CreateProductDTO = {
        name: "Mango2",
        description: "test2",
        price: "440",
      };

      const target: Product = new Product();
      target.id = productId;
      target.name = "Mango";
      target.description = "test";
      target.price = "220";

      const updated: Product = new Product();
      target.id = productId;
      target.name = dto.name;
      target.description = dto.description;
      target.price = dto.price;

      jest
        .spyOn(mockRepository, "findOneBy")
        .mockImplementation(async () => {
          return target;
        });

      jest
        .spyOn(mockRepository, "save")
        .mockImplementation(async () => {
          return updated;
        });

      expect(service.updateProduct(productId, dto)).resolves.toEqual(updated);
    });
  });

  describe("updateProduct()", () => {
    it("更新対象データがない場合、NotFoundExceotionをthrowすること", () => {
      const productId: number = 1;
      const dto: CreateProductDTO = {
        name: "Mango2",
        description: "test2",
        price: "440",
      };

      jest
        .spyOn(mockRepository, "findOneBy")
        .mockImplementation(async () => {
          return null;
        });

      expect(service.updateProduct(productId, dto)).rejects.toEqual(
        new NotFoundException('Product not found')
      );
    });
  });

  describe("deleteProduct()", () => {
    it("データ削除に成功すること", () => {
      const productId: number = 1;
      const result: DeleteResult = new DeleteResult();
      result.affected = 1;

      jest
        .spyOn(mockRepository, "delete")
        .mockImplementation(async () => {
          return result;
        });

      expect(service.deleteProduct(productId)).resolves.toEqual(result);
    });
  });

  describe("deleteProduct()", () => {
    it("データ削除に失敗した場合、InternalServerErrorExceptionがthrowされること", () => {
      const productId: number = 1;
      const msg: string = "Password has expired";

      jest
        .spyOn(mockRepository, "delete")
        .mockRejectedValue(new UnauthorizedException(msg));

      expect(service.deleteProduct(productId)).rejects.toEqual(
        new InternalServerErrorException(`[${msg}]: Failed to delete product`,)
      );
    });
  });
});
