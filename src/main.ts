import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/catalog/Catalog";
import { CatalogView } from "./components/view/CatalogView";
import { WebLarekService } from "./entities/api/WebLarekService";
import { OrderDTO, Product } from "./types";
import { API_URL } from "./utils/constants";
import { ModalView } from "./components/view/ModalView";
import { Cart } from "./components/models/cart/Cart";
import { HeaderView } from "./components/view/Header";
import { Buyer } from "./components/models/buyer/Buyer";
import { OrderPresenter } from "./components/view/OrderPresenter";

const events = new EventEmitter();
const api = new WebLarekService(API_URL);
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const gallery = document.querySelector(".gallery") as HTMLElement;
const catalogView = new CatalogView(gallery, events);

const headerEl = document.querySelector("header") as HTMLElement;
const headerView = new HeaderView(headerEl, events);

events.on<Product[]>("catalog:products:changed", (items) => {
  catalogView.render(items);
});

api
  .getProducts()
  .then((items) => catalog.saveProducts(items))
  .catch((err) => console.error("Ошибка при загрузке товаров:", err));

const modalEl = document.getElementById("modal-container") as HTMLElement;
const modal = new ModalView(modalEl, events);

events.on<Product>("card:select", (product) => {
  modal.openProduct(product);
});

events.on("cart:open", () => {
  modal.openCart(cart.getItems(), cart.getTotal());
});

events.on<Product>("card:add-to-cart", (product) => {
  cart.addItem(product);
});

events.on<Product>("cart:remove", (product) => {
  cart.removeItem(product.id);
});

events.on<{
  items: Product[];
  total: number;
  count: number;
}>("cart:changed", ({ items, total, count }) => {
  headerView.setCounter(count);

  const isCartOpen =
    modalEl.classList.contains("modal_active") &&
    modalEl.querySelector(".basket");

  if (isCartOpen) {
    modal.updateCart(items, total);
  }
});

new OrderPresenter(events, modal, cart, buyer);

events.on("order:complete", async () => {
  const buyerData = buyer.getData();
  const cartItems = cart.getItems();
  const total = cart.getTotal();

  const order: OrderDTO = {
    payment: buyerData.payment!,
    address: buyerData.address!,
    phone: buyerData.phone!,
    email: buyerData.email!,
    items: cartItems.map((item) => item.id),
    total,
  };

  try {
    const response = await api.createOrder(order);
    modal.openSuccess(total);
    cart.clearItems();
    events.emit("cart:changed", { items: [], total: 0, count: 0 });
  } catch (error) {
    console.error("❌ Ошибка при отправке на сервер:", error);
  }
});
