import { Carousel } from "bootstrap";
import BsElement from "../core/BsElement.js";

export default class BsCarousel extends BsElement {
  
  static get properties() {
    return {
      fade: {
        description: "",
        type: Boolean,
        default: false
      },
      indicators: {
        description: "",
        type: Boolean,
        default: true
      },
      interval: {
        description: "The time interval (in milliseconds) between automatic transitions of the carousel items.",
        type: Number,
        default: 5000,
        attribute: 'data-bs-interval'
      },
      keyboard: {
        description: "A Boolean indicating whether the carousel should respond to keyboard navigation.",
        type: Boolean,
        default: true,
        attribute: 'data-bs-keyboard'
      },
      pause: {
        description: "A Boolean indicating whether automatic cycling of the carousel should pause on hover.",
        type: Boolean,
        default: true,
        attribute: 'data-bs-pause'
      },
      ride: {
        description: "A Boolean indicating whether the carousel should automatically cycle through items.",
        type: Boolean,
        default: true,
        attribute: 'data-bs-ride'
      },
      touch: {
        description: "A Boolean indicating whether the carousel should support left/right swipe interactions on touchscreen",
        type: Boolean,
        default: true,
        attribute: 'data-bs-touch'
      },
      wrap: {
        description: "A Boolean indicating whether the carousel should cycle continuously or have hard stops",
        type: Boolean,
        default: true,
        attribute: 'data-bs-wrap'
      }
    }
  }
  
  static get bs() {
    return Carousel;
  }

  cycle() {
    return this.bs?.cycle();
  }

  next() {
    return this.bs?.next();
  }

  nextWhenVisible() {
    return this.bs?.nextWhenVisible();
  }

  pause() {
    return this.bs?.pause();
  }

  prev() {
    return this.bs?.prev();
  }

  to(idx) {
    return this.bs?.to(idx);
  }

  firstUpdated() {
    this.classList.add("carousel");
    this.classList.add("slide");
    
    this._fixMarkup();
    this._updateFadeState();
    this._updateIndicatorsState();
  }

  _fixMarkup() {
    // ensure inner wrapper
    let inner = this.querySelector(":scope > .carousel-inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "carousel-inner";

      // move suitable children into inner
      const toMove = [];
      for (const child of Array.from(this.childNodes)) {
        if (child.nodeType !== Node.ELEMENT_NODE) continue;
        const el = child;
        if (el.classList && (el.classList.contains("carousel-indicators") || el.classList.contains("carousel-control-prev") || el.classList.contains("carousel-control-next") || el.classList.contains("carousel-inner"))) continue;
        toMove.push(el);
      }

      toMove.forEach(el => {
        // if element is already a carousel-item, just append
        if (el.classList && el.classList.contains("carousel-item")) inner.appendChild(el);
        else {
          const wrap = document.createElement("div");
          wrap.className = "carousel-item";
          wrap.appendChild(el);
          inner.appendChild(wrap);
        }
      });

      // insert inner at the end (indicators may be inserted before it later)
      this.appendChild(inner);
    }

    // ensure every child of inner has the proper classes
    const items = Array.from(inner.children).filter(n => n.nodeType === Node.ELEMENT_NODE);
    items.forEach((it, i) => {
      it.classList.add("carousel-item");
      if (!inner.querySelector(".carousel-item.active") && i === 0) {
        it.classList.add("active");
      }
    });

    // indicators and controls
    this._ensureControls();
  }

  _renderIndicators() {
    // remove existing indicators container
    let indicators = this.querySelector(":scope > .carousel-indicators");
    if (indicators) indicators.remove();

    const inner = this.querySelector(":scope > .carousel-inner");
    if (!inner) return;

    indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

    const slides = Array.from(inner.children).filter(n => n.nodeType === Node.ELEMENT_NODE);
    slides.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Slide ${idx + 1}`);
      btn.className = idx === 0 ? "active" : "";
      btn.addEventListener("click", () => this.to(idx));
      indicators.appendChild(btn);
    });

    // insert indicators before inner
    this.insertBefore(indicators, inner);
    this._renderIndicatorsActive();
  }

  _ensureControls() {
    // prev
    if (!this.querySelector(":scope > .carousel-control-prev")) {
      const prev = document.createElement("button");
      prev.className = "carousel-control-prev";
      prev.type = "button";
      prev.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>`;
      prev.addEventListener("click", () => this.prev());
      this.appendChild(prev);
    }

    // next
    if (!this.querySelector(":scope > .carousel-control-next")) {
      const next = document.createElement("button");
      next.className = "carousel-control-next";
      next.type = "button";
      next.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>`;
      next.addEventListener("click", () => this.next());
      this.appendChild(next);
    }
  }

  _renderIndicatorsActive() {
    const indicators = this.querySelector(":scope > .carousel-indicators");
    const inner = this.querySelector(":scope > .carousel-inner");
    if (!indicators || !inner) return;

    const slides = Array.from(inner.children).filter(n => n.nodeType === Node.ELEMENT_NODE);
    const activeIndex = slides.findIndex(s => s.classList.contains("active"));

    Array.from(indicators.children).forEach((btn, idx) => {
      btn.classList.toggle("active", idx === activeIndex);
      if (idx === activeIndex) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
  }

  _updateFadeState() {
    this.classList.toggle("carousel-fade", !!this.fade);
  }

  _updateIndicatorsState() {
    if (this.indicators) {
      this._renderIndicators();
    } else {
      const el = this.querySelector(".carousel-indicators");
      if (el) el.remove();
    }
  }

}

customElements.define("bs-carousel", BsCarousel);