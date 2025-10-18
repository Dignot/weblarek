import { Product } from "../../types";
import { IEvents } from "../base/Events";
import { BaseCard } from "./BaseCard";

export class CardBasket extends BaseCard {
  private deleteBtn: HTMLButtonElement | null;
  private indexEl: HTMLElement | null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.deleteBtn = this.container.querySelector(".basket__item-delete");
    this.indexEl = this.container.querySelector(".basket__item-index");

    if (this.deleteBtn) {
      this.deleteBtn.addEventListener("click", () => {
        this.events.emit("cart:remove", { id: this.id });
        this.events.emit("cart:changed");
      });
    }
  }

  render(data: Product & { index?: number }): HTMLElement {
    super.render(data);

    if (this.indexEl && data.index !== undefined) {
      this.indexEl.textContent = String(data.index);
    }

    return this.container;
  }
}
