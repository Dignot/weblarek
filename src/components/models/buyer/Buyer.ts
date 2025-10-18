import type { BuyerData, ValidationResult } from "../../../types";
import { IEvents } from "../../base/Events";

export class Buyer {
  private data: BuyerData = {
    payment: null,
    address: "",
    phone: "",
    email: "",
  };

  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  saveData(partial: Partial<BuyerData>) {
    this.data = { ...this.data, ...partial };
    this.events.emit("buyer:data:changed", { ...this.data });
  }

  getData(): BuyerData {
    return { ...this.data };
  }

  clearData() {
    this.data = { payment: null, address: "", phone: "", email: "" };
    this.events.emit("buyer:data:cleared");
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
}
