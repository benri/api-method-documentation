[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-method-documentation.svg)](https://www.npmjs.com/package/@api-components/api-method-documentation)

[![Build Status](https://travis-ci.org/api-components/api-method-documentation.svg?branch=stage)](https://travis-ci.org/api-components/api-method-documentation)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/api-components/api-method-documentation)

## &lt;api-method-documentation&gt;

A HTTP method documentation generated from AMF model.

```html
<api-method-documentation></api-method-documentation>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @api-components/api-method-documentation
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@api-components/api-method-documentation/api-method-documentation.js';
    </script>
  </head>
  <body>
    <api-method-documentation></api-method-documentation>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-method-documentation/api-method-documentation.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-method-documentation></api-method-documentation>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/api-components/api-method-documentation
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
