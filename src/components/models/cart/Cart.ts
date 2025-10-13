import type { Product } from "../../../types";
import type { EventEmitter } from "../../base/Events";

export class Cart {
  private items: Product[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  private emitChange() {
    this.events.emit("cart:changed", {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  getItems(): Product[] {
    return [...this.items];
  }

  addItem(product: Product) {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.emitChange();
    }
  }

  removeItem(productOrId: Product | string) {
    const id = typeof productOrId === "string" ? productOrId : productOrId.id;
    this.items = this.items.filter((p) => p.id !== id);
    this.emitChange();
  }

  clearItems() {
    this.items = [];
    this.emitChange();
  }

  getTotal(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((p) => p.id === id);
  }
}
