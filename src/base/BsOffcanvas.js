import { Offcanvas } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsOffcanvas extends BsElement {
  
  static get properties() {
    return {
      backdrop: {
        description: "Controls whether the backdrop is displayed behind the offcanvas.",
        type: Boolean,
        default: true,
        attribute: "data-bs-backdrop"
      },
      fade: {
        description: "Controls whether to use a fade animation when opening/closing the offcanvas.",
        type: Boolean,
        default: true
      },
      header: {
        description: "The header content of the offcanvas.",
        type: String,
        default: ""
      },
      open: {
        description: "Used to control the modal state",
        type: Boolean,
        default: false
      },
      keyboard: {
        description: "Controls whether keyboard interaction is enabled for closing the offcanvas.",
        type: Boolean,
        default: true,
        attribute: "data-bs-keyboard"
      },
      placement: {
        description: "The placement of the offcanvas.",
        type: String,
        default: "start",
        values: ["start", "end", "top", "bottom"]
      },
      scroll: {
        description: "Controls whether to allow scrolling of the body when the offcanvas is open.",
        type: Boolean,
        default: false,
        attribute: "data-bs-scroll"
      },
      size: {
        description: "Specify the size of the modal.",
        type: String,
        default: "",
        values: ["sm", "md", "lg", "xl", "xxl"]
      }
    }
  }
  
  static get bs() {
    return Offcanvas;
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

  toggle() {
    return this.bs?.toggle();
  }

  firstUpdated() {
    this.classList.add("offcanvas");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "-1");

    this._fixMarkup();
    this._updateFadeState();
    this._updatePlacementState();
    this._updateSizeState();
    this._updateOpenState(true);
  }

  _fixMarkup() {
    let header = this.querySelector(":scope > .offcanvas-header");
    if (!header) {
      header = document.createElement("div");
      header.classList.add("offcanvas-header");
      header.insertAdjacentHTML("afterbegin", `<h5 class="offcanvas-title">${this.header ?? ""}</h5>`);
      header.insertAdjacentHTML("beforeend",
        `<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>`
      );
      this.appendChild(header);
    }

    if (!header.querySelector(".btn-close")) {
      header.insertAdjacentHTML("beforeend",
        `<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>`
      );
    }

    let body = this.querySelector(":scope > .offcanvas-body");
    if (!body) {
      body = document.createElement("div");
      body.classList.add("offcanvas-body");
      this.appendChild(body);
    }

    for (const node of Array.from(this.childNodes)) {
      if (node === header || node === body) continue;
      body.appendChild(node)
    }
  }

  _updateHeaderState() {
    const title = this.querySelector(":scope > .offcanvas-header > .offcanvas-title");
    if (title) title.textContent = this.header ?? "";
  }

  _updateFadeState() {
    this.classList.toggle("fade", this.fade);
  }

  _updatePlacementState() {
    this.classList.remove(
      ...this.constructor.properties
        .placement.values.map(v => "offcanvas-" + v)
    );
    if (this.placement) this.classList.add(`offcanvas-${this.placement}`);
  }

  _updateSizeState() {
    this.classList.remove(
      ...this.constructor.properties
        .size.values.map(v => "offcanvas-" + v)
    );
    if (this.size) this.classList.add(`offcanvas-${this.size}`);
  }

  _updateOpenState(isFirstUpdate = false) {
    if (isFirstUpdate) this.classList.toggle("show", this.__propValues['open']);
    else this.toggle();
  }

}

customElements.define("bs-offcanvas", BsOffcanvas);