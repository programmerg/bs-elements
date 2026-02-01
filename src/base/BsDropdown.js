import { Dropdown } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsDropdown extends BsElement {
  
  static get properties() {
    return {
      autoClose: {
        description: "A boolean indicating whether the Dropdown should automatically close when an item is selected.",
        type: Boolean,
        default: true,
        attribute: "data-bs-auto-close"
      },
      direction: {
        description: "The direction of the Dropdown menu",
        type: String,
        default: "down",
        values: ["down", "start", "end", "up", "down-center", "up-center"]
      },
      open: {
        description: "A boolean indicating whether the Dropdown is currently open.",
        type: Boolean,
        default: false
      }
    };
  }

  static get bs() {
    return Dropdown;
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

  update() {
    return this.bs?.update();
  }
  
  firstUpdated() {
    this.classList.add("dropdown");

    // Ensure toggle has the proper data attribute
    const toggle = this.querySelector(
      `:scope > [data-bs-toggle="dropdown"], :scope > .dropdown-toggle`
    );
    if (toggle && !toggle.hasAttribute("data-bs-toggle")) {
      toggle.setAttribute("data-bs-toggle", "dropdown");
    }

    this._fixMarkup();
    this._updateDirectionState();
    this._updateOpenState(true);
  }

  _fixMarkup() {
    // Ensure bs-dropdown-menu children receive Bootstrap class
    const menu = this.querySelector(":scope > div, :scope > .dropdown-menu");
    if (menu && !menu.classList.contains("dropdown-menu")) {
      menu.classList.add("dropdown-menu");
    }
  }

  _updateDirectionState() {
    this.classList.remove(
      ...this.constructor.properties
        .direction.values.map(v => "drop" + v)
    );
    this.classList.add("drop" + this.direction);
  }

  _updateOpenState(isFirstUpdate = false) {
    if (isFirstUpdate) this.classList.toggle("show", this.__propValues['open']);
    else this.toggle();
  }

}

customElements.define("bs-dropdown", BsDropdown);