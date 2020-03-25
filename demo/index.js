import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@polymer/paper-toast/paper-toast.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-styles/typography.js';
import '@anypoint-web-components/anypoint-styles/din-pro.js';
import '../api-method-documentation.js';

class ComponentDemo extends ApiDemoPage {
  constructor() {
    super();
    this.componentName = 'api-method-documentation';
    this.renderViewControls = true;

    this.initObservableProperties([
      'compatibility',
      'selectedAmfId',
      'noTryit',
      'codeSnippets',
      'renderSecurity',
      'endpoint',
      'method',
      'previous',
      'next',
      'graph',
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
    const { value } = e.detail;
    this.compatibility = value === 1;
    if (this.compatibility) {
      document.body.classList.add('anypoint');
    } else {
      document.body.classList.remove('anypoint');
    }
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
    const webApi = this._computeWebApi(this.amf);
    const endpoint = this._computeMethodEndpoint(webApi, id);
    if (!endpoint) {
      this.endpoint = undefined;
      this.method = undefined;
      return;
    }
    this.endpoint = endpoint;

    const methods = this._computeOperations(webApi, endpoint['@id']);
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
    let name = this._getValue(item, this.ns.aml.vocabularies.core.name);
    if (!name) {
      name = this._getValue(item, this.ns.aml.vocabularies.apiContract.method);
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
    let name = this._getValue(item, this.ns.aml.vocabularies.core.name);
    if (!name) {
      name = this._getValue(item, this.ns.aml.vocabularies.apiContract.method);
    }
    this.next = {
      id: item['@id'],
      label: name
    };
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['google-drive-api', 'Google Drive'],
      ['appian-api', 'Appian API'],
      ['loan-microservice', 'Loan microservice (OAS)'],
      // ['array-body', 'Request body with an array (reported issue)'],
      // ['nexmo-sms-api', 'Nexmo SMS API'],
      // ['SE-12957', 'OAS query parameetrs documentation'],
      // ['SE-12959', 'OAS summary field'],
      // ['SE-12752', 'Query string (SE-12752)'],
      ['oas-callbacks', 'OAS 3 callbacks']
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
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
      compatibility,
      amf,
      narrow,
      endpoint,
      method,
      previous,
      next,
      codeSnippets,
      renderSecurity,
      noTryit,
      graph,
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the API method documentation element with various
        configuration options.
      </p>

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
            ?compatibility="${compatibility}"
            ?graph="${graph}"
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
          >With code snippets</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="renderSecurity"
          .checked="${renderSecurity}"
          @change="${this._toggleMainOption}"
          >With security</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="graph"
          @change="${this._toggleMainOption}"
          >Graph experiment</anypoint-checkbox
        >
      </arc-interactive-demo>
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
            <b>Compatibility</b> - To provide compatibility with Anypoint design, use
            <code>compatibility</code> property
          </li>
        </ul>
      </section>`;
  }

  contentTemplate() {
    return html`
    <paper-toast text="Try it event detected" id="tryItToast"></paper-toast>
    <h2 class="centered main">API method documentation</h2>
    ${this._demoTemplate()}
    ${this._introductionTemplate()}
    ${this._usageTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
