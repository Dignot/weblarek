import { Product } from "../../types";
import { IEvents } from "../base/Events";
import { BaseCard } from "./BaseCard";

export class CardPreview extends BaseCard {
  private button: HTMLButtonElement | null;
  private inCart = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.button = this.container.querySelector(".card__button");

    if (this.button) {
      this.button.addEventListener("click", () => {
        if (!this.product) return;

        if (this.inCart) {
          this.events.emit("cart:remove", this.product);
        } else {
          this.events.emit("card:add-to-cart", this.product);
        }
      });
    }

    this.events.on("cart:changed", () => {
      if (this.product) {
        this.events.emit("cart:has", {
          id: this.product.id,
          callback: (exists: boolean) => this.setInCart(exists),
        });
      }
    });
  }

  render(data: Product): HTMLElement {
    super.render(data);
    this.product = data;

    this.events.emit("cart:has", {
      id: data.id,
      callback: (exists: boolean) => this.setInCart(exists),
    });

    return this.container;
  }

  setInCart(state: boolean) {
    this.inCart = state;
    if (!this.button) return;

    if (state) {
      this.button.textContent = "Удалить из корзины";
    } else {
      this.button.textContent = "В корзину";
    }
  }
}
