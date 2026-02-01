import { Toast } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsToast extends BsElement {
  
  static get properties() {
    return {
      color: {
        description: "Color of the Toast background.",
        type: String,
        default: "",
        values: ["", "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"]
      },
      header: {
        description: "Customize the modal header content.",
        type: String,
        default: undefined
      },
      autohide: {
        description: "Controls whether the Toast component autohides after a certain duration.",
        type: Boolean,
        default: false,
        attribute: "data-bs-autohide"
      },
      delay: {
        description: "The time delay (in milliseconds) before the Toast component autohides.",
        type: Number,
        default: 5000,
        attribute: "data-bs-delay"
      },
      animation: {
        description: "Controls whether the Toast component fades in and out.",
        type: Boolean,
        default: true,
        attribute: "data-bs-animation"
      },
      open: {
        description: "Controls whether the Toast component is initially open.",
        type: Boolean,
        default: true
      },
      dismissible: {
        description: "Controls whether the Toast component is dismissible",
        type: Boolean,
        default: true
      }
    }
  }
  
  static get bs() {
    return Toast;
  }

  constructor() {
    super();
    
    // this is an external state managed by bootstrap
    Object.defineProperty(this.constructor.prototype, "open", {
      get() {
        return this.classList.contains("show");
      },
    });
  }

  hide() {
    return this.bs?.hide();
  }

  show() {
    return this.bs?.show();
  }

  isShown() {
    return this.bs?.isShown();
  }

  firstUpdated() {
    this.classList.add("toast");
    if (!this.hasAttribute("role")) this.setAttribute("role", "alert");
    if (!this.hasAttribute("aria-live")) this.setAttribute("aria-live", "assertive");
    if (!this.hasAttribute("aria-atomic")) this.setAttribute("aria-atomic", "true");

    this._fixMarkup();
    this._updateHeaderState();
    this._updateDismissibleState();
    this._updateColorState();
    this._updateOpenState(true);
  }

  _fixMarkup() {
    let header = this.querySelector(":scope > .toast-header");
    if (!header && this.header) {
      header = document.createElement("div");
      header.classList.add("toast-header");
      
      header.insertAdjacentHTML("afterbegin", `<strong class="me-auto">${this.header}</strong>`);
      
      this.appendChild(header);
    }

    let body = this.querySelector(":scope > .toast-body");
    if (!body) {
      body = document.createElement("div");
      body.classList.add("toast-body");

      for (let i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].classList?.contains("toast-header")) continue;
        body.appendChild(this.childNodes[i]);
      }
      
      this.appendChild(body);
    }
  }

  _updateHeaderState() {
    let header = this.querySelector(":scope > .toast-header");
    if (!header && this.header) {
      this._fixMarkup();
      header = this.querySelector(":scope > .toast-header");
      header.textContent = this.header || "";
    }
    if (header && !this.header) {
      header.remove();
    }
  }

  _updateDismissibleState() {
    const closeBtn = this.querySelector(".btn-close");
    if (this.dismissible) {
      if (!closeBtn) this.firstChild?.insertAdjacentHTML("beforeend",
        `<button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>`
      );
    } else {
      if (closeBtn) closeBtn.remove();
    }
  }

  _updateColorState() {
    this.classList.remove(
      ...this.constructor.properties
        .color.values.map(v => "bg-" + v)
    );
    if (this.color) this.classList.add("bg-" + this.color);

    if (this.color === "" || this.color === "light" || this.color === "warning") {
      this.classList.remove("text-white");
    } else {
      this.classList.add("text-white");
    }
  }
  
  _updateOpenState(isFirstUpdate = false) {
    const newState = this.__propValues['open'];
    if (isFirstUpdate) this.classList.toggle("show", newState);
    else {
      if (newState) this.show();
      else this.hide();
    }
  }

}

customElements.define("bs-toast", BsToast);