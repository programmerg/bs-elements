import { Button } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsButton extends BsElement {
  
  static get properties() {
    return {
      active: {
        description: "Indicates if the component is active.",
        type: Boolean,
        default: false
      },
      color: {
        description: "Color theme for the button.",
        type: String,
        default: undefined,
        values: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"]
      },
      outline: {
        description: "Indicates if the component should have an outline.",
        type: Boolean,
        default: false
      },
      size: {
        description: "Size of the Button.",
        type: String,
        default: undefined,
        values: ["sm", "lg"]
      },
      toggle: {
        description: "Bootstrap toggle type.",
        type: String,
        default: undefined,
        values: ["button", "collapse", "dropdown", "modal", "offcanvas", "tab"]
      },
      target: {
        description: "Target selector for toggles (data-bs-target).",
        type: String,
        default: undefined
      }
    }
  }

  static get bs() {
    return Button;
  }

  constructor() {
    super();

    // this is an external state managed by bootstrap
    Object.defineProperty(this.constructor.prototype, "active", {
      get() {
        return this.classList.contains("active");
      },
    });
  }

  // toggle() {
  //   return this.bs?.toggle();
  // }

  firstUpdated() {
    //this.classList.add("btn");

    // default type to prevent accidental form submit
    if (!this.hasAttribute("type")) this.setAttribute("type", "button");

    this._updateColorState();
    this._updateOutlineState();
    this._updateSizeState();
    this._updateToggleState();
    this._updateTargetState();
    this._updateActiveState(true);
  }

  _updateColorState() {
    this.classList.remove(
      ...this.constructor.properties
        .color.values.map(v => "btn-" + v)
    );
    this.classList.remove(
      ...this.constructor.properties
        .color.values.map(v => "btn-outline-" + v)
    );

    const variant = this.outline ? `btn-outline-${this.color}` : `btn-${this.color}`;
    this.classList.add(variant);
  }

  _updateOutlineState() {
    this._updateColorState();
  }

  _updateSizeState() {
    this.classList.remove(
      ...this.constructor.properties
        .size.values.map(v => "btn-" + v)
    );
    if (this.size) this.classList.add("btn-" + this.size);
  }

  _updateToggleState() {
    if (this.toggle) this.setAttribute("data-bs-toggle", this.toggle);
    else this.removeAttribute("data-bs-toggle");
  }

  _updateTargetState() {
    if (this.target) this.setAttribute("data-bs-target", this.target);
    else this.removeAttribute("data-bs-target");
  }

  _updateActiveState(isFirstUpdate = false) {
    if (isFirstUpdate) {
      this.classList.toggle("active", !!this.__propValues['active']);

      if (this.toggle === "button") {
        this.setAttribute("aria-pressed", this.active ? "true" : "false");
      } else {
        this.removeAttribute("aria-pressed");
      }
    } else {
      this.toggle();
    }
  }

}

customElements.define("bs-button", BsButton);