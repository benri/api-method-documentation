[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-method-documentation.svg)](https://www.npmjs.com/package/@api-components/api-method-documentation)

[![Build Status](https://travis-ci.com/advanced-rest-client/api-method-documentation.svg)](https://travis-ci.org/api-components/api-method-documentation)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-method-documentation)

## &lt;api-method-documentation&gt;

A HTTP method documentation generated from an AMF model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

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
      import '@api-components/api-method-documentation/api-method-documentation.js';
    </script>
  </head>
  <body>
    <api-method-documentation amf="..." endpoint="..." method="..."></api-method-documentation>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-method-documentation/api-method-documentation.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-method-documentation
      .amf="${this.amf}"
      .endpoint="${this.endpoint}"
      .method="${this.method}"
      .previous="${this.previous}"
      .next="${this.next}"
      ?rendercodesnippets="${this.codeSnippets}"
      ?narrow="${this.narrow}"
      .renderSecurity="${this.renderSecurity}"
      .noTryIt="${this.noTryit}"
      ?legacy="${this.legacy}"
      @tryit-requested="${this._tryitHandler}"></api-method-documentation>
    `;
  }

  _tryitHandler(e) {
    console.log('opening api-request-panel...');
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/api-components/api-method-documentation
cd api-method-documentation
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
