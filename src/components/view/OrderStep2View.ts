import { Component } from "../base/Component";
import { Buyer } from "../models/buyer/Buyer";
import { EventEmitter } from "../base/Events";

export class OrderStep2View extends Component<{}> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorEl: HTMLElement;

  constructor(
    template: HTMLTemplateElement,
    private buyer: Buyer,
    private events: EventEmitter
  ) {
    const element = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(element);

    this.emailInput = element.querySelector('input[name="email"]')!;
    this.phoneInput = element.querySelector('input[name="phone"]')!;
    this.submitButton = element.querySelector("button[type='submit']")!;
    this.errorEl = element.querySelector(".form__errors")!;

    this.emailInput.addEventListener("input", () => this.updateState());
    this.phoneInput.addEventListener("input", () => this.updateState());

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  private updateState() {
    this.buyer.saveData({
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    });

    const emailValid =
      this.emailInput.value.includes("@") &&
      this.emailInput.value.includes(".");
    const phoneValid = this.phoneInput.value.replace(/\D/g, "").length >= 10;

    if (!emailValid) {
      this.showError("Некорректный email");
      this.submitButton.disabled = true;
      return;
    }

    if (!phoneValid) {
      this.showError("Укажите телефон");
      this.submitButton.disabled = true;
      return;
    }

    this.showError("");
    this.submitButton.disabled = false;
  }

  private showError(message: string) {
    this.errorEl.textContent = message;
  }

  private onSubmit() {
    this.events.emit("order:submit");
  }

  render(): HTMLElement {
    return this.container;
  }
}
