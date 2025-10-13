import { Component } from "../base/Component";
import { Product } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductPreviewView extends Component<Product> {
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private titleEl: HTMLElement;
  private textEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  private inCart: boolean = false;
  private productId!: string;

  constructor(
    template: HTMLTemplateElement,
    private events: EventEmitter,
    private isInCart: (id: string) => boolean
  ) {
    const element = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(element);

    this.imageEl = element.querySelector(".card__image")!;
    this.categoryEl = element.querySelector(".card__category")!;
    this.titleEl = element.querySelector(".card__title")!;
    this.textEl = element.querySelector(".card__text")!;
    this.priceEl = element.querySelector(".card__price")!;
    this.buttonEl = element.querySelector(".card__button")!;

    this.buttonEl.addEventListener("click", () => {
      if (!this.productId) return;
      if (this.buttonEl.disabled) return;

      if (this.inCart) {
        this.events.emit("cart:remove", { id: this.productId });
      } else {
        this.events.emit("cart:add", { id: this.productId });
      }
      this.toggleButton();
    });
  }

  private toggleButton() {
    this.inCart = !this.inCart;
    this.buttonEl.textContent = this.inCart
      ? "Удалить из корзины"
      : "В корзину";
  }

  render(data: Product): HTMLElement {
    this.productId = data.id;
    this.imageEl.src = data.image;
    this.imageEl.alt = data.title;
    this.categoryEl.textContent = data.category;
    this.titleEl.textContent = data.title;
    this.textEl.textContent = data.description;
    this.priceEl.textContent = data.price
      ? `${data.price} синапсов`
      : "Бесценно";

    if (data.price === null) {
      this.buttonEl.textContent = "Недоступно";
      this.buttonEl.disabled = true;
    } else {
      this.buttonEl.disabled = false;

      this.inCart = this.isInCart(data.id);

      this.buttonEl.textContent = this.inCart
        ? "Удалить из корзины"
        : "В корзину";
    }

    return this.container;
  }
}
