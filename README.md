<p align="center">
  <img src="https://programmerg.github.io/bs-elements/logo.svg" alt="bs-elements" width="128" height="128">
</p>

# bs-elements

bs-elements is a **framework-agnostic Web Component library** built around the Bootstrap philosophy.

The same HTML markup, styles, JavaScript API, and events you already know, just wrapped in a **declarative Custom Element API** — without hiding, replacing, or reinventing anything. It feels more natural, composable, and built for modern development.

Use it with vanilla JS or any framework you like.

## ℹ️ How it works?

1. Place `bs-elements.min.js` script at the bottom of your [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/) page.
2. Use our custom elements e.g. `<bs-modal>` instead of generic `<div>` elements.
3. Skip the boilerplate parts if you want and enjoy reactivity! ✨

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
  
    <bs-modal class="modal" data-bs-backdrop="static" header="Modal title" dismissible open>
      <p>Modal body text goes here.</p>
    </bs-modal>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@programmerg/bs-elements@0.1.0/dist/bs-elements.min.js"></script>
  </body>
</html>
```

We have different type of builds:

- `.min.js` - standalone, minimized
- `.boundle.min.js` - this also includes the bootstrap boundle
- `.esm.js` - ES Module version

CDN links

```html
<script src="https://cdn.jsdelivr.net/npm/@programmerg/bs-elements@0.1.0/dist/bs-elements.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@programmerg/bs-elements@0.1.0/dist/bs-elements.boundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@programmerg/bs-elements@0.1.0/dist/bs-elements.esm.js" type="module"></script>
```

Package managers

- `npm install @programmerg/bs-elements`
- `import BsElements from '@programmerg/bs-elements'` 

## 🎯 Goals

- Expose Bootstrap 5 components as **Custom Elements**
- Work everywhere: **Vanilla JS, React, Vue, Svelte**
- Preserve **full Bootstrap compatibility** (HTML, JS API, events)
- Reduce boilerplate while adding behavior

Explicitly not a goal:

- Inventing a new design system
- Replacing Bootstrap CSS and JS

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

## 🔁 Content Routing

- Components do not render templates
- All children stay in the light DOM
- The component may:
  - recognize child roles
  - add required classes
  - move nodes when structurally necessary

**Auto boilerplate generation**

If required Bootstrap structure is missing, bs-elements fills the gap.

```html
<bs-modal>
  <div class="modal-header">Title</div>
  <p>This will automatically become the modal-body</p>
</bs-modal>
```

## 📡 Lifecycle

- `connectedCallback` → initialize Bootstrap instance
- Attribute changes → synchronize options
- `disconnectedCallback` → clean up

---

<p align="center">Made with ❤️, HTML and JS.</p>