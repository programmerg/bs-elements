import { Tab } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsTab extends BsElement {
  
  static get properties() {
    return {
      fade: {
        description: "Control the fade effect when opening or closing the modal.",
        type: Boolean,
        default: true
      },
      active: {
        description: "Whether the element is active or not",
        type: Boolean,
        default: false
      }
    }
  }
  
  static get bs() {
    return Tab;
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

  show() {
    return this.bs?.show();
  }

  firstUpdated() {
    this.classList.add("tab-pane");
    if (!this.hasAttribute("role")) this.setAttribute("role", "tabpanel");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");

    this._updateFadeState();
    this._updateActiveState(true);
  }

  _updateFadeState() {
    this.classList.toggle("fade", this.fade);
  }

  _updateActiveState(isFirstUpdate = false) {
    const newState = this.__propValues["active"];
    if (isFirstUpdate) {
      this.classList.toggle("show", newState);
      this.classList.toggle("active", newState);
    } else {
      if (newState) this.show();
      else {
        this.classList.toggle("show", false);
        this.classList.toggle("active", false);
      }
    }
  }

}

customElements.define("bs-tab", BsTab);