import { Tooltip } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsTooltip extends BsElement {
  
  static get properties() {
    return {
      animation: {
        description: "Flag to enable animation for the tooltip.",
        type: Boolean,
        default: true,
        attribute: "data-bs-animation"
      },
      title: {
        description: "The title to be displayed within the tooltip.",
        type: String,
        default: "",
        attribute: "data-bs-title"
      },
      delay: {	
        description: "The delay for showing the tooltip (in milliseconds).",
        type: Number,
        default: 0,
        attribute: "data-bs-delay"
      },
      html: {
        description: "",
        type: Boolean,
        default: false,
        attribute: "data-bs-html"
      },
      open: {
        description: "Controls the visibility of the tooltip.",
        type: Boolean,
        default: false
      },
      placement: {
        description: "The preferred placement of the tooltip.",
        type: String,
        default: "top",
        attribute: "data-bs-placement"
      },
      trigger: {
        description: "The trigger action to open/close the popover.",
        type: String,
        default: "click",
        attribute: "data-bs-trigger"
      },
      container: {
        description: "the popover’s HTML appears within that element.",
        type: String,
        default: "body",
        attribute: "data-bs-container"
      }
    }
  }

  static get bs() {
    return Tooltip;
  }

  constructor() {
    super();
    
    // this is an external state managed by bootstrap
    Object.defineProperty(this.constructor.prototype, "open", {
      get() {
        return this.bs?.tip && this.bs?.tip.classList.contains('show');
      },
    });
  }
  
  disable() {
    return this.bs?.disable();
  }
  
  enable() {
    return this.bs?.enable();
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

  toggleEnabled() {
    return this.bs?.toggleEnabled();
  }

  setContent() {
    return this.bs?.setContent();
  }

  update() {
    return this.bs?.update();
  }

  firstUpdated() {
    if (!this.hasAttribute("data-bs-toggle")) this.setAttribute("data-bs-toggle", "tooltip");

    this._updateOpenState(true);
  }

  _updateOpenState(isFirstUpdate = false) {
    if (isFirstUpdate) this.classList.toggle("show", this.__propValues['open']);
    else this.toggle();
  }

}

customElements.define("bs-tooltip", BsTooltip);