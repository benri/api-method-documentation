import { html, LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import httpMethodStyles from '@api-components/http-method-label/http-method-label-common-styles.js';
import styles from './Styles.js';

/**
 * `api-url`
 *
 * Renders the view for a URL given a server or a plan string URI value
 *
 * If a URI string is provided, then the URI will be prioritized over the server
 * Otherwise, the component will extract the necessary information from the server
 * object to render the corresponding URI.
 *
 * The ApiUrl component will also receive an optional endpoint and operation in order
 * to render the operation name and the endpoint path.
 *
 * For HTTP protocols:
 *  - HTTP method
 *  - Base URI
 *  - Endpoint path
 *  - Operation path
 *
 * For non-HTTP protocols:
 *  - Operation method
 *  - Protocol
 *  - URL
 *  - Operation name
 * @fires change
 */
export class ApiUrl extends AmfHelperMixin(LitElement) {
  static get properties() {
    return {
      /**
       * AMF model for Server object
       */
      server: { type: Object },
      /**
       * AMF model for Endpoint object
       */
      endpoint: { type: Object },
      /**
       * AMF model for Operation object
       */
      operation: { type: Object },
      /**
       * Optional parameter to be injected into the URL
       */
      apiVersion: { type: String },
      /**
       * Optional override of the URL. If this property is set, then that will
       * be the base URI regardless of server and endpoint
       * @attribute
       */
      baseUri: { type: String },
      _url: { type: String },
      _method: { type: String },
      _protocol: { type: String },
      _protocolVersion: { type: String },
      _operation: { type: Object },
      _server: { type: Object }
    };
  }

  get styles() {
    return [markdownStyles, httpMethodStyles, styles];
  }

  get isNotHttp() {
    const { server } = this;
    if (server) {
      const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.protocol);
      const protocol = this._getValue(server, key);
      if (!protocol) {
        return false;
      }
      return protocol.toLowerCase() !== 'http' && protocol.toLowerCase() !== 'https';
    }
    return false;
  }

  get operation() {
    return this._operation;
  }

  set operation(value) {
    const old = this._operation;
    if (old === value) {
      return;
    }
    this._operation = value;
    this.requestUpdate('operation', old);
    this._updateMethod();
    this._updateUrl();
  }

  get server() {
    return this._server;
  }

  set server(value) {
    const old = this._server;
    if (old === value) {
      return;
    }
    this._server = value;
    this.requestUpdate('server', old);
    this._updateProtocol();
    this._updateProtocolVersion();
    this._updateUrl();
  }

  get endpoint() {
    return this._endpoint;
  }

  set endpoint(value) {
    const old = this._endpoint;
    if (old === value) {
      return;
    }
    this._endpoint = value;
    this.requestUpdate('endpoint', old);
    this._updateUrl();
  }

  get apiVersion() {
    return this._apiVersion;
  }

  set apiVersion(value) {
    const old = this._apiVersion;
    if (old === value) {
      return;
    }
    this._apiVersion = value;
    this.requestUpdate('apiVersion', old);
    this._updateUrl();
  }

  get path() {
    if (this.endpoint) {
      return this._getValue(this.endpoint, this._getAmfKey(this.ns.aml.vocabularies.apiContract.path));
    }
    return '';
  }

  get url() {
    if (this.baseUri) {
      return this.baseUri;
    }
    return this._url;
  }

  render() {
    const method = this._method;
    const url = this.url;
    return html`
      <style>
        ${this.styles}
      </style>
      <section class="url-area">
        <div class="method-value"><span class="method-label" data-method="${method}">${method}</span></div>
        ${this._getPathTemplate()}
        <div class="url-value">${url}</div>
      </section>
      <clipboard-copy id="urlCopy" .content="${url}"></clipboard-copy>
    `;
  }

  _getPathTemplate() {
    if (this.isNotHttp) {
      return html`
        ${this.path}
      `;
    }
    return undefined;
  }

  _updateMethod() {
    this._method = this._computeMethod(this._operation);
    this._dispatchChangeEvent();
  }

  _updateProtocol() {
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.protocol);
    this._protocol = this._getValue(this._server, key);
    this._dispatchChangeEvent();
  }

  _updateProtocolVersion() {
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.protocolVersion);
    this._protocolVersion = this._getValue(this._server, key);
  }

  _updateUrl() {
    const { _server, baseUri, apiVersion: version, _endpoint, _protocol } = this;
    const options = { baseUri, version };
    options.server = _server;
    if (this.isNotHttp) {
      options.ignorePath = true;
    }
    if (_protocol) {
      options.protocols = [_protocol];
    }
    this._url = this._computeUri(_endpoint, options);
    this._dispatchChangeEvent();
  }

  /**
   * Computes value for `httpMethod` property.
   *
   * @param {Object} operation AMF `supportedOperation` model
   * @return {String|undefined} HTTP method name
   */
  _computeMethod(operation) {
    const methodKey = this.ns.aml.vocabularies.apiContract.method;
    let name = this._getValue(operation, methodKey);
    if (name) {
      name = name.toUpperCase();
    }
    return name;
  }

  _dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('onchange', {
        bubbles: true,
        composed: true,
        detail: {
          url: this._url,
          protocol: this._protocol,
          method: this._method
        }
      })
    );
  }
}
