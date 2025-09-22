import type { Product } from "../../../types";

export class Cart {
  private items: Product[] = [];

  getItems(): Product[] {
    return [...this.items];
  }

  addItem(product: Product) {
    if (!this.hasItem(product.id)) this.items.push(product);
  }

  removeItem(productOrId: Product | string) {
    const id = typeof productOrId === "string" ? productOrId : productOrId.id;
    this.items = this.items.filter((p) => p.id !== id);
  }

  clearItems() {
    this.items = [];
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
