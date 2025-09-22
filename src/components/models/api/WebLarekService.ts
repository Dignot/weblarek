import type {
  IApi,
  Product,
  ProductListDTO,
  OrderDTO,
  OrderResponseDTO,
} from "./../../../types";

export class WebLarekService {
  constructor(private readonly api: IApi) {}

  async fetchProducts(): Promise<Product[]> {
    const data = await this.api.get<ProductListDTO>("/product/");
    return data.items;
  }

  async createOrder(payload: OrderDTO): Promise<OrderResponseDTO> {
    return this.api.post<OrderResponseDTO>("/order", payload, "POST");
  }
}
