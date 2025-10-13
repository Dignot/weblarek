export class Modal {
  private container: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLElement;

  constructor(selector: string) {
    this.container = document.querySelector(selector)!;
    this.content = this.container.querySelector(".modal__content")!;
    this.closeBtn = this.container.querySelector(".modal__close")!;

    this.closeBtn.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(content: HTMLElement) {
    this.content.innerHTML = "";
    this.content.append(content);
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.container.classList.remove("modal_active");
    this.content.innerHTML = "";
    document.body.style.overflow = "";
  }
}
