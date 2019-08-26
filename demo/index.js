import { html, render } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@api-components/api-navigation/api-navigation.js';
import '@polymer/paper-toast/paper-toast.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '../api-method-documentation.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ComponentDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this._componentName = 'api-method-documentation';

    this.initObservableProperties([
      'legacy',
      'narrow',
      'selectedAmfId',
      'noTryit',
      'codeSnippets',
      'renderSecurity',
      'endpoint',
      'method',
      'previous',
      'next'
    ]);
    this.noTryit = false;
    this.codeSnippets = true;
    this.renderSecurity = true;

    this.demoStates = ['Material', 'Anypoint'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._tryitRequested = this._tryitRequested.bind(this);
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.legacy = false;
        break;
      case 1:
        this.legacy = true;
        break;
    }
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  get helper() {
    if (!this.__helper) {
      this.__helper = document.getElementById('helper');
    }
    return this.__helper;
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'method') {
      this.setData(selected);
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  setData(id) {
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const endpoint = helper._computeMethodEndpoint(webApi, id);
    if (!endpoint) {
      this.endpoint = undefined;
      this.method = undefined;
      return;
    }
    this.endpoint = endpoint;

    const methods = helper._computeOperations(webApi, endpoint['@id']);
    let last;
    for (let i = 0, len = methods.length; i < len; i++) {
      const item = methods[i];
      if (item['@id'] !== id) {
        last = item;
        continue;
      }
      this.method = item;
      this._setPrevious(last);
      this._setNext(methods[i + 1]);
      break;
    }
  }

  _setPrevious(item) {
    if (!item) {
      this.previous = undefined;
      return;
    }
    const helper = this.helper;
    let name = helper._getValue(item, helper.ns.schema.schemaName);
    if (!name) {
      name = helper._getValue(item, helper.ns.w3.hydra.core + 'method');
    }
    this.previous = {
      id: item['@id'],
      label: name
    };
  }

  _setNext(item) {
    if (!item) {
      this.next = undefined;
      return;
    }
    const helper = this.helper;
    let name = helper._getValue(item, helper.ns.schema.schemaName);
    if (!name) {
      name = helper._getValue(item, helper.ns.w3.hydra.core + 'method');
    }
    this.next = {
      id: item['@id'],
      label: name
    };
  }

  _apiListTemplate() {
    return [
      ['google-drive-api', 'Google Drive'],
      ['demo-api', 'Demo API'],
      ['appian-api', 'Applian API'],
      ['loan-microservice', 'Loan microservice (OAS)'],
      ['array-body', 'Request body with an array (reported issue)'],
      ['nexmo-sms-api', 'Nexmo SMS API']
    ].map(([file, label]) => html`
      <paper-item data-src="${file}-compact.json">${label} - compact model</paper-item>
      <paper-item data-src="${file}.json">${label}</paper-item>
      `);
  }

  _tryitRequested() {
    const toast = document.getElementById('tryItToast');
    toast.opened = true;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      legacy,
      amf,
      narrow,
      endpoint,
      method,
      previous,
      next,
      codeSnippets,
      renderSecurity,
      noTryit
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the API method documentation element with various
        configuration options.
      </p>

      <section class="horizontal-section-container centered main">
        ${this._apiNavigationTemplate()}
        <div class="demo-container">

          <arc-interactive-demo
            .states="${demoStates}"
            @state-chanegd="${this._demoStateHandler}"
            ?dark="${darkThemeActive}"
          >

            <div slot="content">
              <api-method-documentation
                .amf="${amf}"
                .endpoint="${endpoint}"
                .method="${method}"
                .previous="${previous}"
                .next="${next}"
                ?rendercodesnippets="${codeSnippets}"
                ?narrow="${narrow}"
                .renderSecurity="${renderSecurity}"
                .noTryIt="${noTryit}"
                ?legacy="${legacy}"
                @tryit-requested="${this._tryitRequested}"></api-method-documentation>
            </div>
            <label slot="options" id="mainOptionsLabel">Options</label>

            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="narrow"
              @change="${this._toggleMainOption}"
              >Narrow view</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="noTryit"
              @change="${this._toggleMainOption}"
              >No try it</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="codeSnippets"
              .checked="${codeSnippets}"
              @change="${this._toggleMainOption}"
              >With cod snippets</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="renderSecurity"
              .checked="${renderSecurity}"
              @change="${this._toggleMainOption}"
              >With security</anypoint-checkbox
            >
          </arc-interactive-demo>
        </div>
      </section>
    </section>`;
  }

  _introductionTemplate() {
    return html `
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          A web component to render documentation for an HTTP method. The view is rendered
          using AMF data model.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html `
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>API request editor comes with 2 predefied styles:</p>
        <ul>
          <li><b>Material Design</b> (default)</li>
          <li>
            <b>Legacy</b> - To provide compatibility with legacy Anypoint design, use
            <code>legacy</code> property
          </li>
        </ul>
      </section>`;
  }

  _render() {
    const { amf } = this;
    render(html`
      ${this.headerTemplate()}

      <demo-element id="helper" .amf="${amf}"></demo-element>
      <paper-toast text="Try it event detected" id="tryItToast"></paper-toast>

      <div role="main">
        <h2 class="centered main">API method documentation</h2>
        ${this._demoTemplate()}
        ${this._introductionTemplate()}
        ${this._usageTemplate()}
      </div>
      `, document.querySelector('#demo'));
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
