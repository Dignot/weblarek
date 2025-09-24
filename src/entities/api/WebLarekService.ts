import { Api } from "../../components/base/Api";
import type {
  Product,
  ProductListDTO,
  OrderDTO,
  OrderResponseDTO,
} from "../../types";

export class WebLarekService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  async getProducts(): Promise<Product[]> {
    const data = await this.get<ProductListDTO>("/product/");
    return data.items;
  }

  createOrder(order: OrderDTO): Promise<OrderResponseDTO> {
    return this.post<OrderResponseDTO>("/order/", order);
  }
}
