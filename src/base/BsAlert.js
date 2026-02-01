import { Alert } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsAlert extends BsElement {
  
  static get properties() {
    return {
      color: {
        description: "The color theme for the alert.",
        type: String,
        default: "success",
        values: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"]
      },
      dismissible: {
        description: "Flag to indicate if the alert is dismissible.",
        type: Boolean,
        default: false
      },
      fade: {
        description: "Flag to enable fade transition.",
        type: Boolean,
        default: true
      },
      open: {
        description: "Controls the visibility of the alert.",
        type: Boolean,
        default: true
      }
    };
  }

  static get bs() {
    return Alert;
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

  close() {
    return this.bs?.close();
  }

  firstUpdated() {
    this.classList.add("alert");
    if (!this.hasAttribute("role")) this.setAttribute("role", "alert");
    
    this._updateColorState();
    this._updateFadeState();
    this._updateDismissibleState();
    this._updateOpenState(true);
  }

  _updateColorState() {
    this.classList.remove(
      ...this.constructor.properties
        .color.values.map(v => "alert-" + v)
    );
    this.classList.add("alert-" + this.color);
  }

  _updateFadeState() {
    this.classList.toggle("fade", this.fade);
  }

  _updateDismissibleState() {
    this.classList.toggle("alert-dismissible", this.dismissible);
    const btn = this.querySelector(":scope > .btn-close");
    const markup = `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    
    if (this.dismissible) {
      if (!btn) this.insertAdjacentHTML("beforeend", markup);
    } else {
      if (btn) btn.remove();
    }
  }

  _updateOpenState(isFirstUpdate = false) {
    this.classList.toggle("show", this.__propValues['open']);
  }

}

customElements.define("bs-alert", BsAlert);