[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-method-documentation.svg)](https://www.npmjs.com/package/@api-components/api-method-documentation)

[![Build Status](https://travis-ci.com/advanced-rest-client/api-method-documentation.svg)](https://travis-ci.org/api-components/api-method-documentation)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-method-documentation)

## &lt;api-method-documentation&gt;

A HTTP method documentation generated from an AMF model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Styling

`<api-method-documentation>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--arc-font-headline-color` | Color of the method title | ``
`--arc-font-headline-font-size` | Font size of the method title | ``
`--arc-font-headline-letter-spacing` | Letter spacing of the method title | ``
`--arc-font-headline-line-height` | Line height of the method title | ``
`--arc-font-headline-narrow-font-size` | Font size of the method title in mobile-friendly view | ``
`--arc-font-title-color` | Color of the overview section title | ``
`--arc-font-title-font-size` | Font size of the overview section title | ``
`--arc-font-title-line-height` | Line height of the overview section title | ``
`--arc-font-title-narrow-font-size` | Font size of the overview section title in mobile-friendly view | ``
`--arc-font-subhead-color` | Color of the collapsible section title | ``
`--arc-font-subhead-font-size` | Font size of the collapsible section title | ``
`--arc-font-subhead-line-height` | Line height of the collapsible section title | ``
`--arc-font-subhead-narrow-font-size` | Font size of the collapsible section title in mobile-friendly view | ``
`--arc-font-code-family` |  | ``
`--api-method-documentation-url-font-size` |  | `1.07rem`
`--api-method-documentation-url-border-radius` |  | `4px`
`--api-parameters-document-title-border-color` | Border color of the collapsible section title area | `#e5e5e5`
`--api-method-documentation-description-color` |  | `rgba(0, 0, 0, 0.74)`
`--api-method-documentation-operation-id-color` |  | `rgba(0, 0, 0, 0.61)`
`--api-method-documentation-http-method-label-font-size` |  | `inherit`
`--api-method-documentation-http-method-label-width` |  | `inherit`
`--api-method-documentation-bottom-navigation-border-color` |  | `#cfd8dc`
`--api-method-documentation-bottom-navigation-color` |  | `#000`
`--api-method-documentation-section-background-color` |  | `initial`
`--api-method-documentation-section-padding` |  | `0px`
`--api-method-documentation-callback-background-color` |  | `#f7f7f7`
`--code-background-color` |  | ``
`--code-color` |  | ``

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

## API components

This component is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
