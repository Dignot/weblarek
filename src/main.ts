import { EventEmitter } from "./components/base/Events";
import { Buyer } from "./components/models/buyer/Buyer";
import { Cart } from "./components/models/cart/Cart";
import { Catalog } from "./components/models/catalog/Catalog";
import { CatalogCardView } from "./components/view/CatalogCardView";
import { WebLarekService } from "./entities/api/WebLarekService";
import { CDN_URL } from "./utils/constants";
import "./scss/styles.scss";

import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { OrderStep1View } from "./components/view/OrderStep1View";
import { OrderStep2View } from "./components/view/OrderStep2View";
import { ProductPreviewView } from "./components/view/ProductPreviewView";

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

const events = new EventEmitter();
const service = new WebLarekService(API_BASE);
const catalog = new Catalog();
const cart = new Cart(events);
const buyer = new Buyer();

const gallery = document.querySelector(".gallery") as HTMLElement;
const cardTemplate = document.getElementById(
  "card-catalog"
) as HTMLTemplateElement;

const basketButton = document.querySelector(".header__basket") as HTMLElement;
const basketCounter = document.querySelector(
  ".header__basket-counter"
) as HTMLElement;

const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketItemTemplate = document.getElementById(
  "card-basket"
) as HTMLTemplateElement;

const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
const contactsTemplate = document.getElementById(
  "contacts"
) as HTMLTemplateElement;
const successTemplate = document.getElementById(
  "success"
) as HTMLTemplateElement;

const previewTemplate = document.getElementById(
  "card-preview"
) as HTMLTemplateElement;

const modal = new Modal("#modal-container");
const basketView = new BasketView(basketTemplate, basketItemTemplate);

function getImageUrl(image: string | null): string {
  if (!image) return "/placeholder.png";
  let clean = image.replace(/^\//, "").replace(/\.svg$/i, ".png");
  return `${CDN_URL}/${clean}`;
}

events.on("cart:changed", (payload: { count: number | string }) => {
  const count = payload?.count ?? 0;
  basketCounter.textContent = String(count);
});

events.on("product:preview", (data) => {
  if (!data) return;
  const { id } = data as { id: string };

  const product = catalog.getProductById(id);
  if (!product) return;

  const preview = new ProductPreviewView(previewTemplate, events, (id) =>
    cart.hasItem(id)
  );

  const element = preview.render(product);
  modal.open(element);
});

events.on("cart:add", (data) => {
  if (!data) return;
  const { id } = data as { id: string };

  const product = catalog.getProductById(id);
  if (product) {
    cart.addItem(product);
  }
});

events.on("cart:remove", (data) => {
  if (!data) return;
  const { id } = data as { id: string };
  cart.removeItem(id);
});

basketButton.addEventListener("click", () => {
  events.emit("basket:open");
});

events.on("basket:open", () => {
  const basketEl = basketView.render({
    items: cart.getItems(),
    total: cart.getTotal(),
    onOrder: () => events.emit("order:open"),
    onDeleteItem: (id) => {
      cart.removeItem(id);
      events.emit("basket:open");
    },
  });
  modal.open(basketEl);
});

events.on("order:open", () => {
  const orderStep1View = new OrderStep1View(orderTemplate, buyer, events);
  modal.open(orderStep1View.render());
});

events.on("order:step2", () => {
  const orderStep2View = new OrderStep2View(contactsTemplate, buyer, events);
  modal.open(orderStep2View.render());
});

events.on("order:submit", async () => {
  try {
    const response = await buyer.submitOrder(service, cart);
    cart.clearItems();
    buyer.clearData();

    const successEl = successTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    successEl.querySelector(
      ".order-success__description"
    )!.textContent = `Списано ${response.total} синапсов`;
    successEl
      .querySelector(".order-success__close")!
      .addEventListener("click", () => modal.close());

    modal.open(successEl);
  } catch (e) {
    alert("Ошибка при оформлении заказа: " + e);
  }
});

(async () => {
  try {
    const products = await service.getProducts();
    catalog.saveProducts(products);
    gallery.innerHTML = "";

    catalog.getProducts().forEach((product) => {
      product.image = getImageUrl(product.image);
      const card = new CatalogCardView(cardTemplate, events);
      const cardEl = card.render(product);
      gallery.append(cardEl);
    });
  } catch (e) {
    console.error("Ошибка:", e);
  }
})();
