import { IEvents } from "../base/Events";
import { Product } from "../../types";
import { CardPreview } from "./CardPreview";

export class ModalView {
  private contentEl: HTMLElement;
  private closeBtn: HTMLElement;

  constructor(private container: HTMLElement, private events: IEvents) {
    this.contentEl = this.container.querySelector(".modal__content")!;
    this.closeBtn = this.container.querySelector(".modal__close")!;

    this.closeBtn.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(content: HTMLElement) {
    this.contentEl.innerHTML = "";
    this.contentEl.appendChild(content);
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";
  }

  openProduct(product: Product) {
    const templateEl = document.getElementById(
      "card-preview"
    ) as HTMLTemplateElement;
    const node = templateEl.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const previewCard = new CardPreview(node, this.events);

    const cardNode = previewCard.render(product);
    this.open(cardNode);
  }

  openCart(items: Product[], total: number) {
    const templateEl = document.getElementById("basket") as HTMLTemplateElement;
    const node = templateEl.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    this.fillCart(node, items, total);
    this.open(node);
  }

  updateCart(items: Product[], total: number) {
    const basketNode = this.contentEl.querySelector(".basket") as HTMLElement;
    if (!basketNode) return;

    this.fillCart(basketNode, items, total);
  }

  private fillCart(container: HTMLElement, items: Product[], total: number) {
    const listEl = container.querySelector(".basket__list") as HTMLElement;
    const totalEl = container.querySelector(".basket__price") as HTMLElement;

    listEl.innerHTML = "";

    items.forEach((product, index) => {
      const template = document.getElementById(
        "card-basket"
      ) as HTMLTemplateElement;
      const itemNode = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      itemNode.querySelector(".basket__item-index")!.textContent = String(
        index + 1
      );
      itemNode.querySelector(".card__title")!.textContent = product.title;
      itemNode.querySelector(
        ".card__price"
      )!.textContent = `${product.price} синапсов`;

      itemNode
        .querySelector(".basket__item-delete")!
        .addEventListener("click", () => {
          this.events.emit("cart:remove", product);
        });

      listEl.appendChild(itemNode);
    });

    totalEl.textContent = `${total} синапсов`;

    const orderBtn = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;

    if (orderBtn) {
      if (items.length === 0) {
        orderBtn.disabled = true;

        const emptyMsg = document.createElement("p");
        emptyMsg.classList.add("basket__empty-message");
        emptyMsg.textContent = "Корзина пуста";
        listEl.appendChild(emptyMsg);
      } else {
        orderBtn.disabled = false;
        orderBtn.onclick = () => this.openOrder();
      }
    }
  }
  openOrder() {
    const template = document.getElementById("order") as HTMLTemplateElement;
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    this.open(node);
    this.events.emit("order:opened", node);
  }

  openContacts() {
    const template = document.getElementById("contacts") as HTMLTemplateElement;
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    this.open(node);
    this.events.emit("contacts:opened", node);
  }

  openSuccess(total: number) {
    const template = document.getElementById("success") as HTMLTemplateElement;
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    node.querySelector(
      ".order-success__description"
    )!.textContent = `Списано ${total} синапсов`;
    node
      .querySelector(".order-success__close")!
      .addEventListener("click", () => {
        this.close();
      });

    this.open(node);
  }
}
