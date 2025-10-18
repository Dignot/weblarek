import { IEvents } from "../base/Events";

export class HeaderView {
  private basketButton: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    this.basketButton = container.querySelector(".header__basket")!;
    this.counterEl = container.querySelector(".header__basket-counter")!;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("cart:open");
    });
  }

  setCounter(count: number) {
    this.counterEl.textContent = String(count);
  }
}
