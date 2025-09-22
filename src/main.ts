import { Api } from "./components/base/Api";
import { WebLarekService } from "./components/models/api/WebLarekService";
import { Buyer } from "./components/models/buyer/Buyer";
import { Cart } from "./components/models/cart/Cart";
import { Catalog } from "./components/models/catalog/Catalog";
import "./scss/styles.scss";

// База: удобнее сразу с /api/weblarek
const API_BASE =
  import.meta.env.VITE_API_BASE ??
  `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

const api = new Api(API_BASE);
const service = new WebLarekService(api);
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

(async () => {
  try {
    const products = await service.fetchProducts();
    catalog.saveProducts(products);
    console.log("Каталог готов:", catalog.getProducts().length, "товаров");

    const firstBuyable = catalog.getProducts().find((p) => p.price != null);
    if (firstBuyable) cart.addItem(firstBuyable);
    console.log("Корзина:", cart.getItems());
    console.log("Сумма:", cart.getTotal());

    buyer.saveData({
      payment: "online",
      address: "Spb Vosstania 1",
      phone: "+71234567890",
      email: "test@test.ru",
    });

    const order = await buyer.submitOrder(api, cart);
    console.log("Заказ оформлен:", order); // { id, total }
  } catch (e) {
    console.error("Ошибка:", e);
  }
})();
