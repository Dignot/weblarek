export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type PaymentMethod = "online" | "cash";

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface BuyerData {
  payment: PaymentMethod | null;
  address: string;
  phone: string;
  email: string;
}

export interface ValidationFieldResult {
  valid: boolean;
  error?: string;
}
export interface ValidationResult {
  valid: boolean;
  fields: {
    payment: ValidationFieldResult;
    address: ValidationFieldResult;
    phone: ValidationFieldResult;
    email: ValidationFieldResult;
  };
}

export interface ProductListDTO {
  total: number;
  items: Product[];
}

export interface OrderDTO {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface OrderResponseDTO {
  id: string;
  total: number;
}
