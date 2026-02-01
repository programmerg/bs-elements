# BsElements

A **Bootstrap 5–based, framework-agnostic Web Component library** built around the Bootstrap philosophy: **class-first markup, minimal abstraction, and a thin DOM wrapper**.

BsElements augments existing Bootstrap HTML and JavaScript with a **declarative Custom Element API** — without hiding, replacing, or reinventing Bootstrap.

---

## 🎯 Goals

- Expose Bootstrap 5 components as **Custom Elements**
- Work everywhere: **Vanilla JS, React, Vue, Svelte**
- Preserve **full Bootstrap compatibility** (HTML, JS API, events)
- Reduce boilerplate while adding behavior

Explicitly not a goal:

- Inventing a new design system
- Replacing Bootstrap CSS
- Shadow DOM isolation

---

## 🚀 Getting started

Good old way

1. Follow the [official guide](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
2. replace `bootstrap.boundle.min.js` with `bs-elements.boundle.min.js`
3. or add the `<script src="bs-elements.min.js"></script>` next to it

ES Modules

- Use the `<script src="bs-elements.esm.js" type="module"></script>`
- or install it with the command: `npm i programmerg/bs-elements`
- then you can import it as `import * from 'bs-elements'`

---

## 🧠 Design Principles

### Bootstrap-first

- Bootstrap documentation is the **single source of truth**
- DOM structure follows Bootstrap, not the component
- Classes are primary; properties are secondary
- The original Bootstrap JS API must continue to work unchanged

### Thin DOM wrapper

- No custom markup generation
- The Custom Element **is the root element**, not an extra wrapper
- Components enhance existing DOM with behavior
- Child markup may be intelligently assisted when missing

### Light DOM only

- No Shadow DOM
- Bootstrap CSS, utilities, and overrides work exactly as expected

### Attribute → state → option mapping

- Attributes initialize internal state
- Attribute changes update state
- The imperative JS API is optional and secondary
- State changes re-initialize the underlying Bootstrap instance

```html
<bs-modal class="modal" data-bs-backdrop="static" open></bs-modal>
```

### Event compatibility

Event names are identical to Bootstrap events

`show.bs.modal`, `shown.bs.modal`, ...

### Idempotent DOM manipulation

- Synchronization is repeatable and safe
- No duplicated nodes
- No destructive re-rendering
- The same HTML remains stable across updates

---

## 🛠️ Technical Decisions

### Custom Elements

- Not exposed as part of the public API surface
- Chosen for:
  - reactive attribute handling
  - lifecycle hooks
  - reduced boilerplate

### Bootstrap

- Bootstrap 5 CSS is an external dependency
- Bootstrap 5 JS is an internal dependency, 
 
We wrap it — we do not reimplement it!

---

## 📦 Component Categories

### Base components

_Wrappers around native Bootstrap JS behavior:_

`bs-alert`, `bs-button`, `bs-carousel`, `bs-collapse`, `bs-dropdown`, `bs-modal`, `bs-offcanvas`, `bs-popover`, `bs-tab`, `bs-toast`, `bs-tooltip`

Responsibilities:

- Attribute → option mapping
- Lifecycle synchronization
- Event forwarding

### Extra components

_Components not provided by Bootstrap itself._

Responsibilities:

- Encapsulate higher-level or domain-specific behavior

---

## 🔁 Content Routing

- Components do not render templates
- All children stay in the light DOM
- The component may:
  - recognize child roles
  - add required classes
  - move nodes when structurally necessary

**Auto boilerplate generation**

If required Bootstrap structure is missing, BsElements fills the gap.

```html
<bs-modal>
  <div class="modal-header">Title</div>
  <p>This will automatically become the modal-body</p>
</bs-modal>
```

---

## 📡 Lifecycle

- `connectedCallback` → initialize Bootstrap instance
- Attribute changes → synchronize options
- `disconnectedCallback` → clean up
