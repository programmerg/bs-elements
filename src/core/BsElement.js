import ReactiveElement from "./ReactiveElement.js";

/**
 * Reactive Element with Bootstrap integration
 */
export default class BsElement extends ReactiveElement {

  constructor() {
    super();

    this.bs = null;
  }
  
  static __bsProps = [];

  static get bsProps() {
    if (this.__bsProps === undefined) {
      this.__bsProps = [];

      // memoize related props
      const props = this.properties || this.properties?.() || {};
      for (const [prop, def] of Object.entries(props)) {
        if ((def.attribute ?? '').startsWith('data-bs-')) this.__bsProps.push(prop);
      }
    }
    return this.__bsProps;
  }
  
  /**
   * Must return a Bootstrap JS constructor (e.g. bootstrap.Modal, bootstrap.Collapse)
   */
  static get bs() {
    return null;
  }

  createInstance() {
    if (!this.constructor.bs || this.bs) return;

    const options = this.constructor.bsProps.reduce((acc, key) => {
      if (key in this.__propValues) acc[key] = this.__propValues[key];
      return acc;
    }, {}) || {};

    this.bs = new this.constructor.bs(this, options);
  }

  dispose() {
    if (!this.bs) return;

    this.bs?.dispose();
    this.bs = null;
  }

  connectedCallback() {
    // try to guess prop initial values from markup when it's not set
    const props = this.properties || this.properties?.() || {};
    for (const [prop, def] of Object.entries(props)) {
      if (this.__propValues[prop] !== undefined) continue;
      this[prop] = def.values?.find(v => this.className.includes(v));
    }
    
    super.connectedCallback();
    this.createInstance();
  }

  updated(changed) {
    super.updated(changed);

    const shouldReinit = this.constructor.bsProps.some(p => changed.has(p));
    if (shouldReinit) {
      this.dispose();
      this.createInstance();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispose();
  }

}