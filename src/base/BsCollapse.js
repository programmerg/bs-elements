import { Collapse } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsCollapse extends BsElement {
  
  static get properties() {
    return {
      open: {
        description: "Toggle visible state",
        type: Boolean,
        default: false
      },
      horizontal: {
        description: "Toggle horizontal collapsing",
        type: Boolean,
        default: false
      },
      parent: {
        description: "Selector of the container element",
        type: String,
        default: undefined,
        attribute: "data-bs-parent"
      },
      toggle: {
        description: "Toggles the collapsible element",
        type: Boolean,
        default: false,
        attribute: "data-bs-toggle"
      }
    };
  }

  static get bs() {
    return Collapse;
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
    this.classList.add("collapse");

    this._updateHorizontalState();
    this._updateOpenState(true);
  }

  _updateHorizontalState() {
    if (this.horizontal) {
      this.classList.add("collapse-horizontal");
      this.style.width ||= "0px";
    } else {
      this.classList.remove("collapse-horizontal");
      this.style.width = "";
    }
  }

  _updateOpenState(isFirstUpdate = false) {
    if (isFirstUpdate) this.classList.toggle("show", this.__propValues['open']);
    else this.toggle();
  }
  
}

customElements.define("bs-collapse", BsCollapse);