import { html, LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import httpMethodStyles from '@api-components/http-method-label/http-method-label-common-styles.js';
import { expandMore, chevronLeft, chevronRight } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-body-document/api-body-document.js';
import '@api-components/api-parameters-document/api-parameters-document.js';
import '@api-components/api-headers-document/api-headers-document.js';
import '@api-components/api-responses-document/api-responses-document.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@advanced-rest-client/http-code-snippets/http-code-snippets.js';
import '@advanced-rest-client/clipboard-copy/clipboard-copy.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@api-components/api-security-documentation/api-security-documentation.js';
import '../api-url.js'
import { ExampleGenerator } from '@api-components/api-example-generator';
import styles from './Styles.js';
/**
 * `api-method-documentation`
 *
 * Renders documentation for a method for an endpoint.
 *
 * This element works with [AMF](https://github.com/mulesoft/amf) data model.
 * To properly compute all the information relevant to method documentation
 * set the following properties:
 *
 * - amf - as AMF's WebApi data model
 * - endpoint - As AMF's EndPoint data model
 * - method - As AMF's SupportedOperation property
 *
 * When set, this will automatically populate the wiew with data.
 *
 * ## Updating API's base URI
 *
 * By default the component render the documentation as it is defined
 * in the AMF model. Sometimes, however, you may need to replace the base URI
 * of the API with something else. It is useful when the API does not
 * have base URI property defined (therefore this component render relative
 * paths instead of URIs) or when you want to manage different environments.
 *
 * To update base URI value either update `baseUri` property or use
 * `iron-meta` with key `ApiBaseUri`. First method is easier but the second
 * gives much more flexibility since it use a
 * [monostate pattern](http://wiki.c2.com/?MonostatePattern)
 * to manage base URI property.
 *
 * When the component constructs the funal URI for the endpoint it does the
 * following:
 * - if `baseUri` is set it uses this value as a base uri for the endpoint
 * - else if `iron-meta` with key `ApiBaseUri` exists and contains a value
 * it uses it uses this value as a base uri for the endpoint
 * - else if `amf` is set then it computes base uri value from main
 * model document
 * Then it concatenates computed base URI with `endpoint`'s path property.
 *
 * ### Example
 *
 * ```html
 * <iron-meta key="ApiBaseUri" value="https://domain.com"></iron-meta>
 * ```
 *
 * To update value of the `iron-meta`:
 * ```javascript
 * new Polymer.IronMeta({key: 'ApiBaseUri'}).value = 'https://other.domain';
 * ```
 *
 * Note: The element will not get notified about the change in `iron-meta`.
 * The change will be reflected whehn `amf` or `endpoint` property chnage.
 *
 * ## Styling
 *
 * `<api-method-documentation>` provides the following custom properties and
 * mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-method-documentation` | Mixin applied to this elment | `{}`
 * `--arc-font-headline` | Theme mixin, Applied to H1 element | `{}`
 * `--api-method-documentation-title` | Mixin applied to the H1 element | `{}`
 * `--api-method-documentation-title-narrow` | Mixin applied to the H1 element
 * in narrow layout | `{}`
 * `--arc-font-title` | Theme mixin, applied to h2 element | `{}`
 * `--api-method-documentation-main-section-title` | Mixin applied to main
 * sections title element (reqyest and response) | `{}`
 * `--api-method-documentation-main-section-title-narrow` | Mixin applied to
 * main sections title element (reqyest and response) in narrow layout | `{}`
 * `--api-method-documentation-subsection-title` | Mixin applied to sub section
 * titles | `{}`
 * `--api-method-documentation-subsection-title-narrow` | Mixin applied to
 * sub section titles in narrow layout | `{}`
 * `--api-method-documentation-title-method-font-weight` | Font weight of method name title. | `500`
 * `--arc-font-code1` | Theme mixin, applied to the URL area | `{}`
 * `--api-method-documentation-url-font-size` | Font size of endpoin URL | `16px`
 * `--api-method-documentation-url-background-color` | Background color of
 * the URL section | `#424242`
 * `--api-method-documentation-url-font-color` | Font color of the URL area | `#fff`
 * `--api-method-documentation-try-it-background-color` | Background color
 * of the Try it button | `--primary-color`
 * `--api-method-documentation-try-it-color` | Color of the Try it button |
 * `--primary-action-color` or `#fff`
 * `--api-method-documentation-try-it-background-color-hover` | Background
 * color of the Try it button when hovered | `--primary-color`
 * `--api-method-documentation-try-it-color-hover` | Color of the Try it
 * button when hovered | `--primary-action-color` or `#fff`
 * `--api-method-documentation-bottom-navigation-border-color` | Color of
 * the top border of the bottom navigartion | `#546E7A`
 * `--api-method-documentation-bottom-navigation-color` | Color of of the
 * bottom navigartion (icon + text) | `#546E7A`
 * `--api-method-documentation-main-sections` | Mixin applied to both request
 * and response sections | `{}`
 * `--api-method-documentation-docs-sections` | Mixin applied to each
 * documentation block | `{}`
 *
 * @customElement
 * @demo demo/index.html
 * @appliesMixin AmfHelperMixin
 */
export class ApiMethodDocumentation extends AmfHelperMixin(LitElement) {
  get styles() {
    return [
      markdownStyles,
      httpMethodStyles,
      styles,
    ];
  }


  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: { type: String },
      /**
       * AMF method definition as a `http://www.w3.org/ns/hydra/core#supportedOperation`
       * object.
       */
      method: { type: Object },
      /**
       * Method's endpoint definition as a
       * `http://raml.org/vocabularies/http#endpoint` of AMF model.
       */
      endpoint: { type: Object },
      /**
       * The try it button is not rendered when set.
       */
      noTryIt: { type: Boolean },
      /**
       * Computed value from the method model, name of the method.
       * It is either a `displayName` or HTTP method name
       */
      methodName: { type: String },
      /**
       * HTTP method name string.
       *
       * It is computed from `endpoint`.
       */
      httpMethod: { type: String },
      /**
       * A property to set to override AMF's model base URI information.
       * When this property is set, the `endpointUri` property is recalculated.
       */
      baseUri: { type: String },
      /**
       * Computed value, API version name
       */
      apiVersion: { type: String },
      /**
       * Endpoint URI to display in main URL field.
       * This value is computed when `amf`, `endpoint` or `baseUri` change.
       */
      endpointUri: { type: String },
      /**
       * Computed value of method description from `method` property.
       */
      description: { type: String },
      /**
       * Computed value from current `method`. True if the model contains
       * custom properties (annotations in RAML).
       */
      hasCustomProperties: { type: Boolean },
      /**
       * Computed value of `http://www.w3.org/ns/hydra/core#expects`
       * of AMF model from current `method`
       */
      expects: { type: Object },
      /**
       * Computed value of the `http://raml.org/vocabularies/http#server`
       * from `amf`
       */
      server: { type: Object },
      /**
       * API base URI parameters defined in AMF api model
       */
      serverVariables: { type: Array },
      /**
       * Endpoint's path parameters.
       */
      endpointVariables: { type: Array },
      /**
       * Computed value if server and endpoint definition of API model has
       * defined any variables.
       */
      hasPathParameters: { type: Boolean },
      /**
       * Computed value of method's query parameters.
       */
      queryParameters: { type: Array },
      /**
       * Computed value, true when either has path or query parameters.
       * This renders `api-parameters-document` if true.
       */
      hasParameters: { type: Boolean },
      /**
       * Computed value of AMF payload definition from `expects`
       * property.
       */
      payload: { type: Array },
      /**
       * Computed value of AMF payload definition from `expects`
       * property.
       */
      headers: { type: Array },
      /**
       * Computed value of AMF response definition from `returns`
       * property.
       */
      returns: { type: Array },
      /**
       * Computed value of AMF security definition from `method`
       * property.
       */
      security: { type: Array },
      /**
       * If set it will renders the view in the narrow layout.
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * Model to generate a link to previous HTTP method.
       * It should contain `id` and `label` properties
       */
      previous: { type: Object },
      /**
       * Model to generate a link to next HTTP method.
       * It should contain `id` and `label` properties
       */
      next: { type: Object },
      /**
       * When set code snippets are rendered.
       */
      _snippetsOpened: { type: Boolean },
      /**
       * When set security details are rendered.
       */
      securityOpened: { type: Boolean },
      /**
       * Whether or not the callbacks toggle is opened.
       */
      callbacksOpened: { type: Boolean },
      /**
       * When set it renders code examples section is the documentation
       */
      renderCodeSnippets: { type: Boolean },

      /**
       * When set it renders security documentation when applicable
       */
      renderSecurity: { type: Boolean },
      /**
       * List of traits and resource types, if any.
       */
      extendsTypes: { type: Array },
      /**
       * List of traits appied to this endpoint
       */
      traits: { type: Array },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
      /**
       * When enabled it renders external types as links and dispatches
       * `api-navigation-selection-changed` when clicked.
       */
      graph: { type: Boolean },
      /**
       * OAS summary field.
       */
      methodSummary: { type: String },

      _renderSnippets: { type: Boolean },
      /**
       * When set it hiddes bottom navigation links
       */
      noNavigation: { type: Boolean },
      /**
       * When set the base URI won't be rendered for this method.
       */
      ignoreBaseUri: { type: Boolean },
      /**
       * Optional protocol for the current method
       */
      protocol: { type: String },
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  get method() {
    return this._method;
  }

  set method(value) {
    const old = this._method;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._method = value;
    this._methodChanged();
  }

  get endpoint() {
    return this._endpoint;
  }

  set endpoint(value) {
    const old = this._endpoint;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._endpoint = value;
    this._endpointChanged();
  }

  get baseUri() {
    return this._baseUri;
  }

  set baseUri(value) {
    const old = this._baseUri;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._baseUri = value;
    this._processServerInfo();
  }

  get ignoreBaseUri() {
    return this._ignoreBaseUri;
  }

  set ignoreBaseUri(value) {
    const old = this._ignoreBaseUri;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._ignoreBaseUri = value;
    this._processServerInfo();
  }

  get expects() {
    return this._expects;
  }

  set expects(value) {
    const old = this._expects;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._expects = value;
    this.requestUpdate('expects', old);
    this._expectsChanged(value);
  }

  get server() {
    return this._server;
  }

  set server(value) {
    const old = this._server;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._server = value;
    this.requestUpdate('server', old);
    this._processServerInfo();
  }

  get _titleHidden() {
    if (!this.noTryIt) {
      return false;
    }
    const { methodName, httpMethod } = this;
    if (!methodName || !httpMethod) {
      return true;
    }
    return methodName.toLowerCase() === httpMethod.toLowerCase();
  }

  constructor() {
    super();
    this.callbacksOpened = false;
  }

  __amfChanged() {
    if (this.__amfProcessingDebouncer) {
      return;
    }
    this.__amfProcessingDebouncer = true;
    setTimeout(() => this._processModelChange());
  }

  _methodChanged() {
    if (this.__methodProcessingDebouncer) {
      return;
    }
    this.__methodProcessingDebouncer = true;
    setTimeout(() => this._processMethodChange());
  }

  _endpointChanged() {
    if (this.__endpointProcessingDebouncer) {
      return;
    }
    this.__endpointProcessingDebouncer = true;
    setTimeout(() => this._processEndpointChange());
  }

  _processModelChange() {
    this.__amfProcessingDebouncer = false;
    const { amf } = this;
    this.apiVersion = this._computeApiVersion(amf);
    this.server = this._computeServer(amf);
    this._processServerInfo();
  }

  _processMethodChange() {
    this.__methodProcessingDebouncer = false;
    const { method } = this;
    this.methodName = this._computeMethodName(method);
    this.description = this._computeDescription(method);
    this.hasCustomProperties = this._computeHasCustomProperties(method);
    this.expects = this._computeExpects(method);
    this.returns = this._computeReturns(method);
    this.security = this._computeSecurity(method) || this._computeSecurity(this.server);
    const extendsTypes = this.extendsTypes = this._computeExtends(method);
    this.traits = this._computeTraits(extendsTypes);
    this.methodSummary = this._getValue(method, this.ns.aml.vocabularies.apiContract.guiSummary);
    this.operationId = this._getValue(method, this.ns.aml.vocabularies.apiContract.operationId);
    this.callbacks = this._computeCallbacks(method);
  }

  _processEndpointChange() {
    this.__endpointProcessingDebouncer = false;
    this._processServerInfo();
  }

  _hasQueryParameters() {
    if (!this.queryParameters) {
      return false;
    }
    return this.queryParameters instanceof Object || this.queryParameters.length
  }

  _expectsChanged(expects) {
    if (!this.endpointVariables) {
      this._processEndpointVariables();
    }
    this.headers = this._computeHeaders(expects);
    this.payload = this._computePayload(expects);
    this.queryParameters = this._computeQueryParameters(expects);
    this.hasParameters = this.hasPathParameters || this._hasQueryParameters();
  }

  _processEndpointVariables() {
    const endpointVariables = this.endpointVariables = this._computeEndpointVariables(this.endpoint, this.expects);
    const hasPathParameters = this.hasPathParameters =
      this._computeHasPathParameters(this.serverVariables, endpointVariables);
    this.hasParameters = hasPathParameters || this._hasQueryParameters();
  }

  /**
   * Updates value for endpoint URI, server and path variables.
   */
  _processServerInfo() {
    const serverVariables = this.serverVariables = this._computeServerVariables(this.server);
    const hasPathParameters = this.hasPathParameters =
      this._computeHasPathParameters(serverVariables, this.endpointVariables);
    this.hasParameters = hasPathParameters || this._hasQueryParameters();
    this._processEndpointVariables();
  }

  /**
   * Computes list of query parameters to be rendered in the query parameters table.
   *
   * The parameters document can pass a type definition for query parameters
   * or a list of properties to be rendered without the parent type definition.
   *
   * @param {Object} scheme Model for Expects shape of AMF model.
   * @return {Array<Object>|Object} Either list of properties or a type definition
   * for a queryString property of RAML's
   */
  _computeQueryParameters(scheme) {
    if (!scheme) {
      return;
    }
    const pKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.parameter);
    let result = this._ensureArray(scheme[pKey]);
    if (result) {
      return result;
    }
    const qKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.queryString);
    result = this._ensureArray(scheme[qKey]);
    if (result) {
      result = this._resolve(result[0]);
    }
    return result;
  }

  /**
   * Computes value for `methodName` property.
   * It is either a `http://schema.org/name` or HTTP method name
   *
   * @param {Object} method AMF `supportedOperation` model
   * @return {String|undefined} Method friendly name
   */
  _computeMethodName(method) {
    let name = this._getValue(method, this.ns.aml.vocabularies.core.name);
    if (!name) {
      name = this._getValue(method, this.ns.aml.vocabularies.apiContract.method);
    }
    return name;
  }
  /**
   * Computes value for `hasPathParameters` property
   *
   * @param {?Array} sVars Current value of `serverVariables` property
   * @param {?Array} eVars Current value of `endpointVariables` property
   * @return {Boolean}
   */
  _computeHasPathParameters(sVars, eVars) {
    return !!((sVars && sVars.length) || (eVars && eVars.length));
  }
  /**
   * "Try it" button click handler. Dispatches `tryit-requested` custom event
   */
  _tryIt() {
    const { method } = this;
    if (!method) {
      return;
    }
    const id = method['@id'];
    this.dispatchEvent(new CustomEvent('tryit-requested', {
      bubbles: true,
      composed: true,
      detail: {
        id
      }
    }));
  }
  /**
   * Navigates to next method. Calls `_navigate` with id of previous item.
   */
  _navigatePrevious() {
    this._navigate(this.previous.id, 'method');
  }
  /**
   * Navigates to next method. Calls `_navigate` with id of next item.
   */
  _navigateNext() {
    this._navigate(this.next.id, 'method');
  }
  /**
   * Dispatches `api-navigation-selection-changed` so other components
   * can update their state.
   *
   * @param {String} id
   * @param {String} type
   */
  _navigate(id, type) {
    const e = new CustomEvent('api-navigation-selection-changed', {
      bubbles: true,
      composed: true,
      detail: {
        selected: id,
        type: type
      }
    });
    this.dispatchEvent(e);
  }
  /**
   * Toggles code snippets section.
   */
  _toggleSnippets() {
    const state = !this._snippetsOpened;
    if (state && !this._renderSnippets) {
      this._renderSnippets = true;
    }
    setTimeout(() => {
      this._snippetsOpened = state;
    });
  }

  _snippetsTransitionEnd() {
    if (!this._snippetsOpened) {
      this._renderSnippets = false;
    }
  }
  /**
   * Toggles security section.
   */
  _toggleSecurity() {
    this.securityOpened = !this.securityOpened;
  }

  /**
   * Toggles security section.
   */
  _toggleCallbacks() {
    this.callbacksOpened = !this.callbacksOpened;
  }

  /**
   * Computes example headers string for code snippets.
   * @param {Array} headers Headers model from AMF
   * @return {String|undefined} Computed example value for headers
   */
  _computeSnippetsHeaders(headers) {
    let result;
    if (headers && headers.length) {
      result = '';
      headers.forEach((item) => {
        const name = this._getValue(item, this.ns.aml.vocabularies.core.name);
        const value = this._computePropertyValue(item) || '';
        result += `${name}: ${value}\n`;
      });
    }
    return result;
  }
  /**
   * Computes example payload string for code snippets.
   * @param {Array} payload Payload model from AMF
   * @return {String|undefined} Computed example value for payload
   */
  _computeSnippetsPayload(payload) {
    if (payload && payload instanceof Array) {
      payload = payload[0];
    }
    if (!payload) {
      return;
    }
    let mt = this._getValue(payload, this.ns.aml.vocabularies.core.mediaType);
    if (!mt) {
      mt = 'application/json';
    }
    const gen = new ExampleGenerator(this.amf);
    const examples = gen.generatePayloadExamples(payload, mt, {});
    if (!examples || !examples[0]) {
      return;
    }
    return examples[0].value;
  }
  /**
   * Tries to find an example value (whether it's default value or from an
   * example) to put it into snippet's values.
   *
   * @param {Object} item A http://raml.org/vocabularies/http#Parameter property
   * @return {String|undefined}
   */
  _computePropertyValue(item) {
    const skey = this._getAmfKey(this.ns.aml.vocabularies.shapes.schema);
    let schema = item && item[skey];
    if (!schema) {
      return;
    }
    if (schema instanceof Array) {
      schema = schema[0];
    }
    let value = this._getValue(schema, this.ns.w3.shacl.defaultValue);
    if (!value) {
      const gen = new ExampleGenerator(this.amf);
      const items = gen.computeExamples(schema, null, { rawOnly: true });
      if (items) {
        value = items[0].value;
      }
    }
    return value;
  }
  // Computes a label for the section toggle buttons.
  _computeToggleActionLabel(opened) {
    return opened ? 'Hide' : 'Show';
  }
  // Computes state of toggle button.
  _computeToggleButtonState(opened) {
    return opened ? 'Collapsed' : 'Expanded';
  }
  // Computes class for the toggle's button icon.
  _computeToggleIconClass(opened) {
    let clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  }
  /**
   * Computes list of "extends" from the shape.
   *
   * @param {Object} shape AMF shape to get `#extends` model from
   * @return {Array<Object>|undefined}
   */
  _computeExtends(shape) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.document.extends);
    return shape && this._ensureArray(shape[key]);
  }
  /**
   * Computes value for `traits` property
   *
   * @param {Array<Object>} types Result of calling `_computeExtends()` or
   * a list of `#extends` models.
   * @return {Array<Object>|undefined}
   */
  _computeTraits(types) {
    if (!types || !types.length) {
      return;
    }
    const data = types.filter((item) =>
      this._hasType(item, this.ns.aml.vocabularies.apiContract.ParametrizedTrait));
    return data.length ? data : undefined;
  }

  /**
   * Computes list of trait names to render it in the doc.
   *
   * @param {Array<Object>} traits AMF trait definition
   * @return {String|undefined} Trait name if defined.
   */
  _computeTraitNames(traits) {
    if (!traits || !traits.length) {
      return;
    }
    const names = traits.map((trait) => this._getValue(trait, this.ns.aml.vocabularies.core.name));
    if (names.length === 2) {
      return names.join(' and ');
    }
    return names.join(', ');
  }

  _apiChanged(e) {
    this.amf = e.detail.value;
  }

  /**
   * Computes as list of OAS' callbacks in current method
   * @param {Object} method A method to process
   * @return {Array<Object>|undefined} List of Callbacks or undefined if none.
   */
  _computeCallbacks(method) {
    if (!method) {
      return;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.callback);
    return this._ensureArray(method[key]);
  }

  render() {
    const {
      aware,
      hasCustomProperties,
      method
    } = this;
    return html`<style>${this.styles}</style>
    ${aware ? html`<raml-aware
      .scope="${aware}"
      @api-changed="${this._apiChanged}"></raml-aware>` : ''}
    ${this._getTitleTemplate()}
    ${this._getUrlTemplate()}
    ${this._getTraitsTemplate()}
    ${hasCustomProperties ? html`<api-annotation-document .shape="${method}"></api-annotation-document>` : ''}
    ${this._getDescriptionTemplate()}
    <section class="request-documentation">
      ${this._getCodeSnippetsTemplate()}
      ${this._getSecurityTemplate()}
      ${this._getParametersTemplate()}
      ${this._getHeadersTemplate()}
      ${this._getBodyTemplate()}
      ${this._callbacksTemplate()}
    </section>
    ${this._getReturnsTemplate()}
    ${this._getNavigationTemplate()}`;
  }

  _getTitleTemplate() {
    if (this._titleHidden) {
      return '';
    }
    const {
      methodName,
      noTryIt,
      compatibility,
      methodSummary,
      operationId,
    } = this;
    return html`
    <div class="title-area">
      <div role="heading" aria-level="1" class="title">${methodName}</div>
      ${noTryIt ? '' : html`<div class="action">
        <anypoint-button
          class="action-button"
          @click="${this._tryIt}"
          emphasis="high"
          ?compatibility="${compatibility}">Try it</anypoint-button>
      </div>`}
    </div>
    ${methodSummary ? html`<p class="summary">${methodSummary}</p>` : ''}
    ${operationId ? html`<span class="operation-id">Operation ID: ${operationId}</span>` : ''}
    `;
  }

  _getUrlTemplate() {
    return html`
    <api-url
      .amf="${this.amf}"
      .server="${this.server}"
      .endpoint="${this.endpoint}"
      .apiVersion="${this.apiVersion}"
      .baseUri="${this.baseUri}"
      .operation="${this.method}"
      @onchange="${this._handleUrlChange}"
    >
    </api-url>`;
  }

  _getTraitsTemplate() {
    const traits = this.traits;
    if (!traits || !traits.length) {
      return '';
    }
    const value = this._computeTraitNames(traits);
    return html`<section class="extensions">
      <span>Mixes in
      <span class="trait-name">${value}</span>.
      </span>
    </section>`;
  }

  _getDescriptionTemplate() {
    const { description } = this;
    if (!description) {
      return '';
    }
    return html`<arc-marked .markdown="${description}" sanitize>
      <div slot="markdown-html" class="markdown-body"></div>
    </arc-marked>`;
  }

  _getCodeSnippetsTemplate() {
    if (!this.renderCodeSnippets) {
      return '';
    }
    if (this.isNonHttpProtocol()) {
      return '';
    }
    const {
      _snippetsOpened,
      _renderSnippets,
      endpointUri,
      httpMethod,
      headers,
      payload,
      compatibility
    } = this;
    const label = this._computeToggleActionLabel(_snippetsOpened);
    const buttonState = this._computeToggleButtonState(_snippetsOpened);
    const iconClass = this._computeToggleIconClass(_snippetsOpened);
    return html`<section class="snippets">
      <div
        class="section-title-area"
        @click="${this._toggleSnippets}"
        title="Toogle code example details"
        ?opened="${_snippetsOpened}"
      >
        <div class="heading3 table-title" role="heading" aria-level="2">Code examples</div>
        <div class="title-area-actions" aria-label="${buttonState}">
          <anypoint-button class="toggle-button" ?compatibility="${compatibility}">
            ${label}
            <span class="icon ${iconClass}">${expandMore}</span>
          </anypoint-button>
        </div>
      </div>
      <iron-collapse .opened="${_snippetsOpened}" @transitionend="${this._snippetsTransitionEnd}">
      ${_renderSnippets ? html`<http-code-snippets
        scrollable
        ?compatibility="${compatibility}"
        .url="${endpointUri}"
        .method="${httpMethod}"
        .headers="${this._computeSnippetsHeaders(headers)}"
        .payload="${this._computeSnippetsPayload(payload)}"></http-code-snippets>` : ''}
      </iron-collapse>
    </section>`;
  }

  _getSecurityTemplate() {
    const { renderSecurity, security } = this;
    if (!renderSecurity || !security || !security.length) {
      return '';
    }
    const { securityOpened, compatibility, amf, narrow } = this;
    const label = this._computeToggleActionLabel(securityOpened);
    const buttonState = this._computeToggleButtonState(securityOpened);
    const iconClass = this._computeToggleIconClass(securityOpened);
    return html`<section class="security">
      <div
        class="section-title-area"
        @click="${this._toggleSecurity}"
        title="Toogle security details"
        ?opened="${securityOpened}"
      >
        <div class="heading3 table-title" role="heading" aria-level="2">Security</div>
        <div class="title-area-actions" aria-label="${buttonState}">
          <anypoint-button class="toggle-button security" ?compatibility="${compatibility}">
            ${label}
            <span class="icon ${iconClass}">${expandMore}</span>
          </anypoint-button>
        </div>
      </div>
      <iron-collapse .opened="${securityOpened}">
        ${security.map((item) => html`<api-security-documentation
          .amf="${amf}"
          .security="${item}"
          ?narrow="${narrow}"
          ?compatibility="${compatibility}"></api-security-documentation>`)}
      </iron-collapse>
    </section>`;
  }

  _getParametersTemplate() {
    if (!this.hasParameters) {
      return '';
    }
    const {
      serverVariables,
      endpointVariables,
      queryParameters,
      amf,
      narrow,
      compatibility,
      graph
    } = this;
    return html`<api-parameters-document
      .amf="${amf}"
      queryopened
      pathopened
      .baseUriParameters="${serverVariables}"
      .endpointParameters="${endpointVariables}"
      .queryParameters="${queryParameters}"
      ?narrow="${narrow}"
      ?compatibility="${compatibility}"
      ?graph="${graph}"></api-parameters-document>`;
  }

  _getHeadersTemplate() {
    const { headers } = this;
    if (!headers || !headers.length) {
      return '';
    }
    const {
      amf,
      narrow,
      compatibility,
      graph
    } = this;
    return html`<api-headers-document
      opened
      .amf="${amf}"
      ?narrow="${narrow}"
      ?compatibility="${compatibility}"
      ?graph="${graph}"
      .headers="${headers}"></api-headers-document>`;
  }

  _getBodyTemplate() {
    const { payload } = this;
    if (!payload || !payload.length) {
      return '';
    }
    const {
      amf,
      narrow,
      compatibility,
      graph
    } = this;
    return html`<api-body-document
      opened
      .amf="${amf}"
      ?narrow="${narrow}"
      ?compatibility="${compatibility}"
      ?graph="${graph}"
      .body="${payload}"></api-body-document>`;
  }

  _getReturnsTemplate() {
    const { returns } = this;
    if (!returns || !returns.length) {
      return '';
    }
    const {
      amf,
      narrow,
      compatibility,
      graph
    } = this;
    return html`<section class="response-documentation">
      <div class="heading2" role="heading" aria-level="1">Responses</div>
      <api-responses-document
        .amf="${amf}"
        ?narrow="${narrow}"
        ?compatibility="${compatibility}"
        ?graph="${graph}"
        .returns="${returns}"></api-responses-document>
    </section>`;
  }

  _callbacksTemplate() {
    const { callbacks } = this;
    if (!callbacks || !callbacks.length) {
      return '';
    }
    const {
      callbacksOpened,
      compatibility,
    } = this;
    const label = this._computeToggleActionLabel(callbacksOpened);
    const buttonState = this._computeToggleButtonState(callbacksOpened);
    const iconClass = this._computeToggleIconClass(callbacksOpened);
    return html`<section class="callbacks">
      <div
        class="section-title-area"
        @click="${this._toggleCallbacks}"
        title="Toogle callbacks details"
        ?opened="${callbacksOpened}"
      >
        <div class="heading3 table-title" role="heading" aria-level="2">Callbacks</div>
        <div class="title-area-actions" aria-label="${buttonState}">
          <anypoint-button class="toggle-button" ?compatibility="${compatibility}">
            ${label}
            <span class="icon ${iconClass}">${expandMore}</span>
          </anypoint-button>
        </div>
      </div>
      <iron-collapse .opened="${callbacksOpened}">
        ${callbacks.map((callback) => this._callbackTemplate(callback))}
      </iron-collapse>
    </section>`;
  }

  _callbackTemplate(callback) {
    const name = this._getValue(callback, this.ns.aml.vocabularies.core.name);
    const endpointKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.endpoint);
    const endpoints = this._ensureArray(callback[endpointKey]);
    if (!endpoints || !endpoints.length) {
      return '';
    }
    const endpoint = endpoints[0];
    const methodKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.supportedOperation);
    const methods = this._ensureArray(endpoint[methodKey]);
    if (!methods || !methods.length) {
      return '';
    }
    const method = methods[0];
    const {
      amf,
      compatibility,
      graph,
    } = this;
    return html`
      <div class="callback-section">
        <div class="heading4 table-title" role="heading" aria-level="3">${name}</div>
        <api-method-documentation
          .amf="${amf}"
          .method="${method}"
          .endpoint="${endpoint}"
          ?compatibility="${compatibility}"
          ?graph="${graph}"
          notryit
          narrow
          nonavigation
          ignorebaseuri
        ></api-method-documentation>
      </div>
    `;
  }

  _handleUrlChange(event) {
    this.endpointUri = event.detail.url;
    this.protocol = event.detail.protocol;
    this.httpMethod = event.detail.method;
  }

  isNonHttpProtocol() {
    const { protocol } = this;
    if (!protocol) {
      return false;
    }
    const lowerCase = protocol.toLowerCase();
    return lowerCase !== 'http' && lowerCase !== 'https';
  }

  _getNavigationTemplate() {
    const { next, previous, noNavigation } = this;
    if (!next && !previous || noNavigation) {
      return '';
    }
    const { compatibility } = this;
    return html`<section class="bottom-nav">
      ${previous ? html`<div class="bottom-link previous" @click="${this._navigatePrevious}">
        <anypoint-icon-button title="${previous.label}" ?compatibility="${compatibility}">
          <span class="icon">${chevronLeft}</span>
        </anypoint-icon-button>
        <span class="nav-label">${previous.label}</span>
      </div>` : ''}
      <div class="nav-separator"></div>
      ${next ? html`<div class="bottom-link next" @click="${this._navigateNext}">
        <span class="nav-label">${next.label}</span>
        <anypoint-icon-button title="${next.label}" ?compatibility="${compatibility}">
          <span class="icon">${chevronRight}</span>
        </anypoint-icon-button>
      </div>` : ''}
    </section>`;
  }

  /**
   * Dispatched when the user requested the "Try it" view.
   * @event tryit-requested
   * @param {String} id ID of requested method in AMF model.
   * It might be required if the request for try it view comes from
   * a context where more than one method is rendered at the same time.
   */
  /**
   * Dispatched when the user requested previous / next
   *
   * @event api-navigation-selection-changed
   * @param {String} selected
   * @param {String} type
   */
}
