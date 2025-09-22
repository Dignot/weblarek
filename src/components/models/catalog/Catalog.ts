import { Product } from "../../../types";

export class Catalog {
  private items: Product[] = [];
  private selectedId: string | null = null;

  saveProducts(items: Product[]) {
    this.items = Array.isArray(items) ? [...items] : [];
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
      return;
    }
    this.selectedId =
      typeof productOrId === "string" ? productOrId : productOrId.id;
  }

  getSelected(): Product | null {
    if (!this.selectedId) return null;
    return this.getProductById(this.selectedId) ?? null;
  }
}
