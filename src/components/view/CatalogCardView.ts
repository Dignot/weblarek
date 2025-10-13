import { Product } from "../../types";
import { EventEmitter } from "../base/Events";
import { BaseCardView } from "./BaseCardView";

export class CatalogCardView extends BaseCardView<Product> {
  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    const element = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(element, events);

    this.container.addEventListener("click", () => {
      console.log(2);
      if (this.productId) {
        console.log(1);
        this.events.emit("product:preview", { id: this.productId });
      }
    });
  }

  render(data: Product): HTMLElement {
    this.setBasicData(data);
    return this.container;
  }
}
