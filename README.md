# &lt;api-method-documentation&gt;

A HTTP method documentation generated from an AMF model.

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-method-documentation.svg)](https://www.npmjs.com/package/@api-components/api-method-documentation)

[![Tests and publishing](https://github.com/advanced-rest-client/api-method-documentation/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-method-documentation/actions/workflows/deployment.yml)

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
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
      .server="${server}"
      .endpoint="${this.endpoint}"
      .method="${this.method}"
      .previous="${this.previous}"
      .next="${this.next}"
      ?renderCodeSnippets="${this.codeSnippets}"
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
