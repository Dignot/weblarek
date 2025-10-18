import { Component } from "../base/Component";

export class BasketView extends Component<{
  items: HTMLElement[];
  total: number;
}> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.listEl = this.container.querySelector(".basket__list")!;
    this.totalEl = this.container.querySelector(".basket__price")!;
    this.orderBtn = this.container.querySelector(".basket__button")!;
  }

  render(data: { items: HTMLElement[]; total: number }): HTMLElement {
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

    data.items.forEach((el) => {
      this.listEl.append(el);
    });

    this.totalEl.textContent = `${data.total} синапсов`;
    this.orderBtn.disabled = false;

    return this.container;
  }
}
