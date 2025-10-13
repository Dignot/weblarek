import { Component } from "../base/Component";
import { Buyer } from "../models/buyer/Buyer";
import { EventEmitter } from "../base/Events";

export class OrderStep1View extends Component<{}> {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
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

    this.paymentButtons = element.querySelectorAll(
      ".order__buttons .button_alt"
    );
    this.addressInput = element.querySelector('input[name="address"]')!;
    this.submitButton = element.querySelector(".order__button")!;
    this.errorEl = element.querySelector(".form__errors")!;

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.selectPayment(btn));
    });

    this.addressInput.addEventListener("input", () => this.updateState());

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  private selectPayment(btn: HTMLButtonElement) {
    this.paymentButtons.forEach((b) => b.classList.remove("button_alt-active"));
    btn.classList.add("button_alt-active");
    this.buyer.saveData({ payment: btn.name as any });
    this.updateState();
  }

  private updateState() {
    this.buyer.saveData({ address: this.addressInput.value });

    const validation = this.buyer.validateData();
    const { payment, address } = validation.fields;

    if (!payment.valid) {
      this.showError(payment.error!);
      this.submitButton.disabled = true;
      return;
    }

    if (!address.valid) {
      this.showError(address.error!);
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
    this.events.emit("order:step2");
  }

  render(): HTMLElement {
    return this.container;
  }
}
