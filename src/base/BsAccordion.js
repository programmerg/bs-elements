import BsElement from "../core/BsElement.js";

export default class BsAccordion extends BsElement {

  static get properties() {
    return {
      flush: {
        description: "Flag to indicate if the alert is dismissible.",
        type: Boolean,
        default: false
      },
      alwaysOpen: {
        description: "Flag to indicate if the alert is dismissible.",
        type: Boolean,
        default: false
      },
      active: {
        description: "Controls the visibility of the alert.",
        type: Number,
        default: 0
      }
    };
  }

  toggle(idx) {
    this.children[idx].querySelector('.accordion-button').click();
  }

  firstUpdated() {
    this.classList.add("accordion");

    this._fixMarkup();
    this._updateAlwaysOpenState();
    this._updateFlushState();
    this._updateActiveState(true);
  }

  _fixMarkup() {
    if (!this.id) this.id = crypto.randomUUID();
    Array.from(this.children).forEach((item, idx) => {
      item.classList.add('accordion-item');

      let header = item.querySelector('.accordion-header');
      if (!header) {
        header = document.createElement('h2');
        header.classList.add('accordion-header');
        item.insertBefore(header, item.firstChild);
      }

      let button = item.querySelector('.accordion-button, [data-bs-toggle="collapse"]');
      if (!button) {
        button = document.createElement('h2');
      }
      button.classList.add('accordion-button');
      button.setAttribute('data-bs-toggle', 'collapse');
      console.log(button)
      if (!button.hasAttribute('type')) button.setAttribute('type', 'button');
      if (button.parentElement !== header) header.appendChild(button);

      let collapse = item.querySelector('.accordion-collapse, .collapse');
      if (!collapse) {
        collapse = document.createElement('div');
      }
      collapse.classList.add('accordion-collapse', 'collapse');
      const collapseId = collapse.id || `${this.id}-collapse-${idx}`;
      collapse.id = collapseId;

      // Ensure collapse content is wrapped in .accordion-body
      let body = collapse.querySelector('.accordion-body');
      if (!body) {
        body = document.createElement('div');
        body.classList.add('accordion-body');
        
        while (collapse.firstChild) {
          body.appendChild(collapse.firstChild);
        }

        collapse.appendChild(body);
      }

      // Wire button -> collapse
      button.setAttribute('data-bs-target', `#${collapseId}`);
      button.setAttribute('aria-controls', collapseId);

      // Set initial expanded/collapsed classes and aria state based on active
      const activeIdx = Number(this.active) || 0;
      if (idx === activeIdx) {
        collapse.classList.add('show');
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
      } else {
        collapse.classList.remove('show');
        if (!button.classList.contains('collapsed')) button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  _updateAlwaysOpenState() {
    this.querySelectorAll('.collapse').forEach(collapse => {
      if (!this.alwaysOpen) collapse.setAttribute('data-bs-parent', `#${this.id}`);
      else collapse.removeAttribute('data-bs-parent');
    });
  }

  _updateFlushState() {
    this.classList.toggle('accordion-flush', this.flush);
  }

  _updateActiveState(isFirstUpdated = false) {
    if (!isFirstUpdated) this.toggle(this.active);
  }

}

customElements.define("bs-accordion", BsAccordion);