import { Buyer } from "./components/models/buyer/Buyer";
import { Cart } from "./components/models/cart/Cart";
import { Catalog } from "./components/models/catalog/Catalog";
import { WebLarekService } from "./entities/api/WebLarekService";
import "./scss/styles.scss";

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

const service = new WebLarekService(API_BASE);
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

(async () => {
  try {
    const products = await service.getProducts();
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

    buyer.saveData({
      payment: "online",
      address: "Spb Vosstania 1",
      phone: "+71234567890",
      email: "test@test.ru",
    });

    const order = await service.createOrder(buyer.buildOrderPayload(cart));
    console.log("Заказ оформлен:", order);
  } catch (e) {
    console.error("Ошибка:", e);
  }
})();
