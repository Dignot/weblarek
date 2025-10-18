import { Product } from "../../../types";
import { IEvents } from "../../base/Events";

export class Catalog {
  private items: Product[] = [];
  private selectedId: string | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  saveProducts(items: Product[]) {
    this.items = Array.isArray(items) ? [...items] : [];
    this.events.emit("catalog:products:changed", this.items); // emit при сохранении
  }

  getProducts(): Product[] {
    return [...this.items];
  }

  getProductById(id: string): Product | undefined {
    return this.items.find((p) => p.id === id);
  }

  saveSelected(productOrId: Product | string | null) {
    if (!productOrId) {
      this.selectedId = null;
      this.events.emit("catalog:selected:changed", undefined); // emit сброса выбора
      return;
    }
    this.selectedId =
      typeof productOrId === "string" ? productOrId : productOrId.id;

    const selected = this.getSelected();
    this.events.emit("catalog:selected:changed", selected ?? undefined);
  }

  getSelected(): Product | null {
    if (!this.selectedId) return null;
    return this.getProductById(this.selectedId) ?? null;
  }
}
