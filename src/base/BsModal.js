import { Modal } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsModal extends BsElement {
  
  static get properties() {
    return {
      focus: {
        description: "Automatically puts focus on the modal with it first opens.",
        type: Boolean,
        default: false,
        attribute: "data-bs-focus"
      },
      backdrop: {
        description: "Controls the visibility of the modal backdrop.",
        type: Boolean,
        default: true,
        attribute: "data-bs-backdrop"
      },
      centered: {
        description: "Auto-positioning of the modal to ensure its centered in the viewport.",
        type: Boolean,
        default: false
      },
      fade: {
        description: "Control the fade effect when opening or closing the modal.",
        type: Boolean,
        default: true
      },
      fullscreen: {
        description: "Determines whether or no the modal is rendered in fullscreen mode.",
        type: String,
        default: "",
        values: ["true", "sm", "md", "lg", "xl", "xxl"]
      },
      header: {
        description: "Customize the modal header content.",
        type: String,
        default: undefined
      },
      open: {
        description: "Used to control the modal state",
        type: Boolean,
        default: false
      },
      keyboard: {
        description: "Ccontrol whether the modal can be closed using the ESC key.",
        type: Boolean,
        default: true,
        attribute: "data-bs-keyboard"
      },
      scrollable: {
        description: "Determines if the modal content should be scrollable.",
        type: Boolean,
        default: false
      },
      size: {
        description: "Specify the size of the modal.",
        type: String,
        default: "",
        values: ["sm", "lg", "xl"]
      }
    };
  }

  static get bs() {
    return Modal;
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

  handleUpdate() {
    return this.bs?.handleUpdate();
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
    this.classList.add("modal");
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "-1");

    this._fixMarkup();
    this._updateFadeState();
    this._updateCenteredState();
    this._updateScrollableState();
    this._updateSizeState();
    this._updateFullscreenState();
    this._updateOpenState(true);
  }

  _fixMarkup() {
    let dialog = this.querySelector(":scope > .modal-dialog");
    if (dialog) return;

    dialog = document.createElement("div");
    dialog.classList.add("modal-dialog");

    const content = document.createElement("div");
    content.classList.add("modal-content");

    let header = this.querySelector(":scope > .modal-header");
    if (!header) {
      header = document.createElement("div");
      header.classList.add("modal-header");
      header.insertAdjacentHTML("afterbegin", `<h5 class="modal-title">${this.header}</h5>`);
    }
    content.appendChild(header);

    if (header.querySelector(".btn-close")) {
      header.insertAdjacentHTML("beforeend", 
        `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`
      );
    }

    let body = this.querySelector(":scope > .modal-body");
    if (!body) {
      body = document.createElement("div");
      body.classList.add("modal-body");
    }
    content.appendChild(body);

    let footer = this.querySelector(":scope > .modal-footer");
    if (footer) {
      content.appendChild(footer);
    }

    while (this.firstChild) {
      body.appendChild(this.firstChild);
    }

    dialog.appendChild(content);
    this.appendChild(dialog);
  }

  _updateHeaderState() {
    const title = this.querySelector(":scope > .modal-dialog > .modal-header > .modal-title");
    if (title) {
      title.textContent = this.header;
    }
  }

  _updateFadeState() {
    this.classList.toggle("fade", this.fade);
  }

  _updateCenteredState() {
    const dialog = this.querySelector(":scope > .modal-dialog");
    dialog?.classList.toggle("modal-dialog-centered", this.centered);
  }

  _updateScrollableState() {
    const dialog = this.querySelector(":scope > .modal-dialog");
    dialog?.classList.toggle("modal-dialog-scrollable", this.scrollable);
  }

  _updateSizeState() {
    const dialog = this.querySelector(":scope > .modal-dialog");
    dialog?.classList.remove(
      ...this.constructor.properties
        .size.values.map(v => "modal-" + v)
    );
    if (this.size) dialog?.classList.add(`modal-${this.size}`);
  }
  
  _updateFullscreenState() {
    const dialog = this.querySelector(":scope > .modal-dialog");
    dialog?.classList.remove(
      ...this.constructor.properties
        .fullscreen.values.map(v => "modal-fullscreen-" + v + "-down")
    );
    if (this.fullscreen) dialog?.classList.add(
      this.fullscreen === "true"
        ? "modal-fullscreen"
        : `modal-fullscreen-${this.fullscreen}-down`
    );
  }

  _updateOpenState(isFirstUpdate = false) {
    if (isFirstUpdate) this.classList.toggle("show", this.__propValues['open']);
    else this.toggle();
  }

}

customElements.define("bs-modal", BsModal);