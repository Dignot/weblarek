import { Product } from "../../types";
import { IEvents } from "../base/Events";
import { BaseCard } from "./BaseCard";

export class CardCatalog extends BaseCard {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener("click", () => {
      if (this.product) {
        this.events.emit("card:select", this.product);
      }
    });
  }

  render(data: Product): HTMLElement {
    super.render(data);
    this.product = data;
    return this.container;
  }
}
