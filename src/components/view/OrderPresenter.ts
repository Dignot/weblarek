import type { IEvents } from "../base/Events";
import type { ModalView } from "../view/ModalView";
import type { Cart } from "../models/cart/Cart";
import type { Buyer } from "../models/buyer/Buyer";

export class OrderPresenter {
  constructor(
    private events: IEvents,
    private modal: ModalView,
    private cart: Cart,
    private buyer: Buyer
  ) {
    this.init();
  }

  private init() {
    this.events.on("order:opened", (orderNode: HTMLElement) =>
      this.handleOrderStep1(orderNode)
    );

    this.events.on("order:step1:complete", (data) => {
      this.buyer.saveData(data);
      this.modal.openContacts();
    });

    this.events.on("contacts:opened", (contactsNode: HTMLElement) =>
      this.handleOrderStep2(contactsNode)
    );

    this.events.on("order:step2:complete", () => {
      const isValid = this.buyer.validateData();
      if (isValid.valid) {
        this.events.emit("order:complete");
      } else {
        console.warn("❌ Buyer data invalid:", isValid);
      }
    });
  }

  private handleOrderStep1(orderNode: HTMLElement) {
    requestAnimationFrame(() => {
      const form = orderNode as HTMLFormElement;
      const nextBtn = form.querySelector(".order__button") as HTMLButtonElement;
      const errorEl = form.querySelector(".form__errors") as HTMLElement;

      let payment: string | null = null;

      form.querySelectorAll("button[name]").forEach((btn) => {
        btn.addEventListener("click", () => {
          payment = btn.getAttribute("name");

          form.querySelectorAll("button[name]").forEach((b) => {
            b.classList.remove("button_alt-active");
          });

          btn.classList.add("button_alt-active");
          validate();
        });
      });

      const addressInput = form.querySelector(
        "input[name='address']"
      ) as HTMLInputElement;
      addressInput.addEventListener("input", validate);

      function validate() {
        if (payment && addressInput.value.trim().length > 0) {
          nextBtn.disabled = false;
          errorEl.textContent = "";
        } else {
          nextBtn.disabled = true;
          errorEl.textContent = "Заполните все поля";
        }
      }

      validate();

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.events.emit("order:step1:complete", {
          payment,
          address: addressInput.value,
        });
      });
    });
  }

  private handleOrderStep2(contactsNode: HTMLElement) {
    requestAnimationFrame(() => {
      const form = contactsNode as HTMLFormElement;

      if (!form || form.getAttribute("name") !== "contacts") {
        return console.warn(
          "❌ Contacts form not found in node:",
          contactsNode
        );
      }

      const payBtn = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;
      const errorEl = form.querySelector(".form__errors") as HTMLElement;
      const emailInput = form.querySelector(
        "input[name='email']"
      ) as HTMLInputElement;
      const phoneInput = form.querySelector(
        "input[name='phone']"
      ) as HTMLInputElement;

      function validate() {
        if (emailInput.value.trim() && phoneInput.value.trim()) {
          payBtn.disabled = false;
          errorEl.textContent = "";
        } else {
          payBtn.disabled = true;
          errorEl.textContent = "Заполните все поля";
        }
      }

      validate();
      emailInput.addEventListener("input", validate);
      phoneInput.addEventListener("input", validate);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.buyer.saveData({
          email: emailInput.value,
          phone: phoneInput.value,
        });

        this.events.emit("order:step2:complete");
      });
    });
  }
}
