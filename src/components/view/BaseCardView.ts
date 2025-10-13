import { Component } from "../base/Component";
import { Product } from "../../types";
import { EventEmitter } from "../base/Events";
import { categoryMap } from "../../utils/constants";

export class BaseCardView<T extends Product> extends Component<T> {
  protected events: EventEmitter;
  protected productId: string | null = null;

  protected titleEl: HTMLElement;
  protected imageEl: HTMLImageElement;
  protected priceEl: HTMLElement;
  protected categoryEl: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this.titleEl = container.querySelector(".card__title")!;
    this.imageEl = container.querySelector(".card__image")!;
    this.priceEl = container.querySelector(".card__price")!;
    this.categoryEl = container.querySelector(".card__category")!;
  }

  protected setBasicData(data: T) {
    this.productId = data.id;

    this.titleEl.textContent = data.title;
    this.priceEl.textContent = data.price
      ? `${data.price} синапсов`
      : "Бесценно";

    this.categoryEl.textContent = data.category;

    this.categoryEl.classList.forEach((cls) => {
      if (cls.startsWith("card__category_") && cls !== "card__category") {
        this.categoryEl.classList.remove(cls);
      }
    });

    const modifier = categoryMap[data.category as keyof typeof categoryMap];
    if (modifier) {
      this.categoryEl.classList.add(modifier);
    }

    if (data.image) {
      this.imageEl.src = data.image;
      this.imageEl.alt = data.title;
    }
  }
}
