import { Popover } from "bootstrap";
import BsTooltip from "./BsTooltip.js";

export default class BsPopover extends BsTooltip {
  
  static get properties() {
    return {
      ...super.constructor.properties,
      content: {
        description: "The content to be displayed within the popover.",
        type: String,
        default: "",
        attribute: "data-bs-content"
      }
    }
  }
  
  static get bs() {
    return Popover;
  }

  firstUpdated() {
    if (!this.hasAttribute("data-bs-toggle")) {
      this.setAttribute("data-bs-toggle", "popover");
    }

    this._updateOpenState(true);
  }
}

customElements.define("bs-popover", BsPopover);