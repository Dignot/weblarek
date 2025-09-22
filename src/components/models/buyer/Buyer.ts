import type {
  BuyerData,
  ValidationResult,
  PaymentMethod,
  OrderDTO,
  OrderResponseDTO,
} from "../../../types";
import type { IApi } from "../../../types";
import { Cart } from "./../cart/Cart";

export class Buyer {
  private data: BuyerData = {
    payment: null,
    address: "",
    phone: "",
    email: "",
  };

  saveData(partial: Partial<BuyerData>) {
    this.data = { ...this.data, ...partial };
  }

  getData(): BuyerData {
    return { ...this.data };
  }

  clearData() {
    this.data = { payment: null, address: "", phone: "", email: "" };
  }

  validateData(): ValidationResult {
    const paymentValid = this.data.payment !== null;
    const addressValid = this.data.address.trim().length > 0;
    const phoneValid = this.data.phone.trim().length > 0;
    const emailValid = this.data.email.trim().length > 0;

    return {
      valid: paymentValid && addressValid && phoneValid && emailValid,
      fields: {
        payment: {
          valid: paymentValid,
          error: paymentValid ? undefined : "Выберите способ оплаты",
        },
        address: {
          valid: addressValid,
          error: addressValid ? undefined : "Укажите адрес",
        },
        phone: {
          valid: phoneValid,
          error: phoneValid ? undefined : "Укажите телефон",
        },
        email: {
          valid: emailValid,
          error: emailValid ? undefined : "Укажите email",
        },
      },
    };
  }

  buildOrderPayload(cart: Cart): OrderDTO {
    const v = this.validateData();
    if (!v.valid) {
      const first =
        Object.values(v.fields).find((f) => !f.valid)?.error ??
        "Данные покупателя невалидны";
      throw new Error(first);
    }
    const { payment, address, phone, email } = this.data;
    return {
      payment: payment as PaymentMethod,
      address,
      phone,
      email,
      total: cart.getTotal(),
      items: cart.getItems().map((i) => i.id),
    };
  }

  async submitOrder(api: IApi, cart: Cart): Promise<OrderResponseDTO> {
    const payload = this.buildOrderPayload(cart);
    return api.post<OrderResponseDTO>("/order", payload, "POST");
  }
}
