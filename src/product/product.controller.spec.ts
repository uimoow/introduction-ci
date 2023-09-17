import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ProductController } from "./product.controller";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";

describe('ProductController', () => {
    let controller: ProductController;
    let mockService: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductController,
                ProductService,
                { provide: getRepositoryToken(Product), useClass: Repository },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        mockService = module.get<ProductService>(ProductService);
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
                .spyOn(mockService, "createProduct")
                .mockImplementation(async () => {
                    return product;
                });

            expect(controller.createProduct(dto)).resolves.toEqual(product);
        });
    });

    describe("getProducts()", () => {
        it("全データ取得に成功すること", () => {
            let product: Product;
            const products: Product[] = [];

            for (let i: number = 1; i <= 5; i++) {
                product = new Product();
                product.id = i;
                product.name = "name" + i;
                product.description = "description" + i;
                product.price = String(100 + i);
                products[i - 1] = product;
            }

            jest
                .spyOn(mockService, "getProducts")
                .mockImplementation(async () => {
                    return products;
                });

            expect(controller.getProducts()).resolves.toEqual(products);
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
                .spyOn(mockService, "getProduct")
                .mockImplementation(async () => {
                    return product;
                });

            expect(controller.getProduct(productId)).resolves.toEqual(product);
        });
    });

    describe("updateProduct()", () => {
        it("データ更新に成功すること", () => {
            const productId: number = 1;
            const dto: CreateProductDTO = {
                name: "Mango",
                description: "test",
                price: "220",
            };

            const product: Product = new Product();
            product.id = productId;
            product.name = "testName";
            product.description = "testDescripition";
            product.price = "100000";

            jest
                .spyOn(mockService, "updateProduct")
                .mockImplementation(async () => {
                    return product;
                });

            expect(controller.updateProduct(dto, productId)).resolves.toEqual(product);
        });
    });

    describe("deleteProduct()", () => {
        it("データ削除に成功すること", () => {
            const productId: number = 1;
            const result: DeleteResult = {
                raw: [],
                affected: 1,
            };

            jest
                .spyOn(mockService, "deleteProduct")
                .mockImplementation(async () => {
                    return result;
                });

            expect(controller.deleteProduct(productId)).resolves.toEqual(result);
        });
    });
});
