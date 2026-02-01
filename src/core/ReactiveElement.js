export default class ReactiveElement extends HTMLElement {
  
  constructor() {
    super();

    // reactive internals
    this.__propValues = Object.create(null);
    this.__changed = new Set();
    this.__updateScheduled = false;
    this.__reflecting = false;

    this.createReactiveProperties();
  }

  /* ------------------------------------------------------------------
   * Reactive helpers
   * ------------------------------------------------------------------ */

  static get properties() {
    return {};
  }

  static __propertyToAttributeMap;

  static __attributeToPropertyMap;

  static propertyToAttribute(property) {
    if (this.__propertyToAttributeMap.size < 1) this.observedAttributes();
    return this.__propertyToAttributeMap.get(property);
  }

  static attributeToProperty(attribute) {
    if (this.__attributeToPropertyMap.size < 1) this.observedAttributes();
    return this.__attributeToPropertyMap.get(attribute);
  }

  static get observedAttributes() {
    if (this.__attributeToPropertyMap === undefined) {
      this.__propertyToAttributeMap = new Map();
      this.__attributeToPropertyMap = new Map();
      
      // memoize mappings
      const props = this.properties || this.properties?.() || {};
      for (const [prop, def] of Object.entries(props)) {
        const attr = def?.attribute ?? prop.replace(/([A-Z])/g, "-$1").toLowerCase();
        this.__propertyToAttributeMap.set(prop, attr);
        this.__attributeToPropertyMap.set(attr, prop);
      }
    }
    return [...this.__attributeToPropertyMap.keys()];
  }

  getAttrValue(attr, type) {
    const value = this.getAttribute(attr);

    switch (type) {
      case Boolean: 
        return this.hasAttribute(attr) && (value === "" || value === "true");
      case Number:
        const n = Number(value);
        return Number.isNaN(n) ? undefined : n;
      default:
        return value === null ? undefined : value;
    }
  }

  setAttrValue(attr, value, type) {
    if (value === null || value === undefined || (type === Boolean && !value)) {
      this.removeAttribute(attr);
    } else {
      this.setAttribute(attr, (type === Boolean) ? "" : String(value));
    }
  }

  createReactiveProperties() {
    const props = this.constructor.properties || this.constructor.properties?.() || {};
    for (const [prop, def] of Object.entries(props)) {
      this.createReactiveProperty(prop, def);
    }
  }

  createReactiveProperty(prop, def) {
    const attr = this.constructor.propertyToAttribute(prop);

    // avoid redefining existing properties
    if (!Object.getOwnPropertyDescriptor(this.constructor.prototype, prop)) {
      Object.defineProperty(this.constructor.prototype, prop, {
        get() {
          return this.__propValues[prop];
        },
        set(value) {
          const old = this.__propValues[prop];
          if (old === value) return;

          this.__propValues[prop] = value;
          
          // reflect props to attributes
          const shouldReflect = def.reflect;
          if (shouldReflect) {
            this.__reflecting = true;
            this.setAttrValue(attr, value, def.type);
            queueMicrotask(() => (this.__reflecting = false));
          }

          this.__changed.add(prop);
          this.scheduleUpdate();
        },
        configurable: true,
        enumerable: true
      });
    }
  
    // seed initial values from attributes or defaults
    this.__propValues[prop] = this.getAttrValue(attr, def.type) ?? def.default;
  }
  
  childrenToSlots(html) {
    var template = document.createElement("template");
    template.innerHTML = html;

    const slots = template.content.querySelectorAll("slot");
    for (const slot of slots) {
      const slotChildren = this.querySelectorAll(`[slot="${slot.name}"]`);
      slotChildren.forEach(el => el.removeAttribute("slot"));
      slot.replaceWith(...slotChildren);
    }

    this.replaceChildren(template.content);
  }

  /* ------------------------------------------------------------------
   * Custom Element Lifecycle
   * ------------------------------------------------------------------ */

  connectedCallback() {
    this.firstUpdated();
  }

  // eslint-disable-next-line class-methods-use-this
  firstUpdated() {}

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (this.__reflecting) return;

    const prop = this.constructor.attributeToProperty(attrName);

    const props = this.constructor.properties || this.constructor.properties?.() || {};
    const def = props[prop] || {};

    const old = this.__propValues[prop];
    const value = this.getAttrValue(attrName, def.type);
    if (old === value) return;
    this.__propValues[prop] = value;
    this.__changed.add(prop);
    this.scheduleUpdate();
  }

  scheduleUpdate() {
    if (this.__updateScheduled) return;
    this.__updateScheduled = true;
    queueMicrotask(() => {
      this.__updateScheduled = false;
      const changed = new Set(this.__changed);
      this.__changed.clear();
      try {
        this.updated(changed);
      } catch (e) {
        console.error(e);
      }
    });
  }

  updated(changed) {
    changed.forEach(prop => {
      const fn = `_update${prop.charAt(0).toUpperCase() + prop.slice(1)}State`;
      if (typeof this[fn] === "function") this[fn]();
    })
  }

  // eslint-disable-next-line class-methods-use-this
  disconnectedCallback() {}

}