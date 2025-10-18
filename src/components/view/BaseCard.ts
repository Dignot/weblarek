import { Product } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class BaseCard extends Component<Product> {
  protected titleEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;
  protected categoryEl: HTMLElement | null;
  protected imageEl: HTMLImageElement | null;
  public id: string | undefined;
  protected product: Product | null = null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.titleEl = this.container.querySelector(".card__title");
    this.priceEl = this.container.querySelector(".card__price");
    this.categoryEl = this.container.querySelector(".card__category");
    this.imageEl = this.container.querySelector(".card__image");
  }

  render(data: Product): HTMLElement {
    this.product = data;
    this.id = data.id;
    if (this.titleEl) this.titleEl.textContent = data.title;
    if (this.priceEl)
      this.priceEl.textContent = data.price
        ? `${data.price} синапсов`
        : "Бесценно";

    if (this.categoryEl) {
      this.categoryEl.textContent = data.category;

      this.categoryEl.className = "card__category";

      const modifier =
        categoryMap[data.category as keyof typeof categoryMap] ||
        "card__category_other";
      this.categoryEl.classList.add(modifier);
    }

    if (this.imageEl) {
      const imageName = data.image.replace(/\.\w+$/, "");
      this.setImage(this.imageEl, `${CDN_URL}/${imageName}.png`, data.title);
    }

    return super.render(data);
  }
}
