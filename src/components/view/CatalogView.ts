import { Product } from "../../types";
import { IEvents } from "../base/Events";
import { CardCatalog } from "./CardCatalog";

export class CatalogView {
  private template: HTMLTemplateElement;

  constructor(private container: HTMLElement, private events: IEvents) {
    const templateEl = document.getElementById("card-catalog");
    if (!templateEl) {
      throw new Error("Не найден <template id='card-catalog'> в HTML");
    }
    this.template = templateEl as HTMLTemplateElement;
  }

  render(products: Product[]) {
    this.container.innerHTML = "";

    for (const product of products) {
      const cardNode = this.template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      const card = new CardCatalog(cardNode, this.events);
      this.container.appendChild(card.render(product));
    }
  }
}
