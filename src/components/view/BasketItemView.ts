import { Component } from "../base/Component";
import { Product } from "../../types";

export class BasketItemView extends Component<Product> {
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private indexEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    const element = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(element);

    this.titleEl = element.querySelector(".card__title")!;
    this.priceEl = element.querySelector(".card__price")!;
    this.indexEl = element.querySelector(".basket__item-index")!;
    this.deleteBtn = element.querySelector(".basket__item-delete")!;
  }

  render(
    data: Product & { index: number; onDelete?: () => void }
  ): HTMLElement {
    this.titleEl.textContent = data.title;
    this.priceEl.textContent = data.price
      ? `${data.price} синапсов`
      : "Бесценно";
    this.indexEl.textContent = String(data.index);

    if (data.onDelete) {
      this.deleteBtn.onclick = data.onDelete;
    }

    return this.container;
  }
}
