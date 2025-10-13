import { Component } from "../base/Component";
import { Product } from "../../types";
import { BasketItemView } from "./BasketItemView";

export class BasketView extends Component<{ items: Product[]; total: number }> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;
  private itemTemplate: HTMLTemplateElement;

  constructor(
    template: HTMLTemplateElement,
    itemTemplate: HTMLTemplateElement
  ) {
    const element = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(element);

    this.listEl = element.querySelector(".basket__list")!;
    this.totalEl = element.querySelector(".basket__price")!;
    this.orderBtn = element.querySelector(".basket__button")!;
    this.itemTemplate = itemTemplate;

    const style = document.createElement("style");
    style.textContent = `
      .basket__empty {
        color: #888;
      }
      .basket__list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `;
    document.head.append(style);
  }

  render(data: {
    items: Product[];
    total: number;
    onOrder?: () => void;
    onDeleteItem?: (id: string) => void;
  }): HTMLElement {
    this.listEl.innerHTML = "";

    if (data.items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "basket__empty";
      empty.textContent = "Корзина пуста";
      this.listEl.append(empty);
      this.orderBtn.disabled = true;
      this.totalEl.textContent = "0 синапсов";
      return this.container;
    }

    data.items.forEach((product, idx) => {
      const item = new BasketItemView(this.itemTemplate);
      const itemEl = item.render({
        ...product,
        index: idx + 1,
        onDelete: () => data.onDeleteItem?.(product.id),
      });
      this.listEl.append(itemEl);
    });

    this.totalEl.textContent = `${data.total} синапсов`;

    this.orderBtn.disabled = data.items.length === 0;

    if (data.onOrder) {
      this.orderBtn.onclick = data.onOrder;
    }

    return this.container;
  }
}
