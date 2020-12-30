import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@polymer/paper-toast/paper-toast.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-styles/typography.js';
import '@anypoint-web-components/anypoint-styles/din-pro.js';
import '@api-components/api-server-selector/api-server-selector.js';
import '../api-method-documentation.js';

class ComponentDemo extends ApiDemoPage {
  constructor() {
    super();

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
      'serverType',
      'serverValue',
    ]);
    this.componentName = 'api-method-documentation';
    this.renderViewControls = true;
    this.noTryit = false;
    this.graph = false;
    this.codeSnippets = true;
    this.renderSecurity = true;

    this.demoStates = ['Material', 'Anypoint'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._tryitRequested = this._tryitRequested.bind(this);
    this._serverHandler = this._serverHandler.bind(this);
  }

  get server() {
    const { serverValue, serverType, endpointId, methodId } = this;
    if (serverType && serverType !== 'server') {
      return null;
    }
    const servers = this._getServers({ endpointId, methodId });
    if (!servers || !servers.length) {
      return null;
    }
    if (!serverValue && servers.length) {
      return servers[0];
    }
    return servers.find((server) => this._getServerUri(server) === serverValue);
  }

  get baseUri() {
    const { serverValue, serverType } = this;
    if (['custom', 'uri'].indexOf(serverType) !== -1) {
      return serverValue;
    }
    return null;
  }

  /**
   * @param {Object} server Server definition.
   * @return {String|undefined} Value for server's base URI
   */
  _getServerUri(server) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.core.urlTemplate);
    return /** @type string */ (this._getValue(server, key));
  }

  _demoStateHandler(e) {
    const { value } = e.detail;
    this.compatibility = value === 1;
    this._updateCompatibility();
  }

  _navChanged(e) {
    const { selected, type, endpointId } = e.detail;
    if (type === 'method') {
      this.setData(selected, endpointId);
      this.hasData = true;
    } else {
      this.hasData = false;
      this.endpointId = null;
      this.methodId = null;
    }
  }

  setData(id, endpointId) {
    this.endpointId = endpointId;
    this.methodId = id;
    const webApi = this._computeApi(this.amf);
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
      ['multi-server', 'Multiple servers'],
      ['google-drive-api', 'Google Drive'],
      ['appian-api', 'Appian API'],
      ['loan-microservice', 'Loan microservice (OAS)'],
      // ['array-body', 'Request body with an array (reported issue)'],
      // ['nexmo-sms-api', 'Nexmo SMS API'],
      // ['SE-12957', 'OAS query parameetrs documentation'],
      // ['SE-12959', 'OAS summary field'],
      ['SE-12752', 'Query string (SE-12752)'],
      ['oas-callbacks', 'OAS 3 callbacks'],
      ['async-api', 'Async API'],
      ['APIC-560', 'APIC-560'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  _tryitRequested() {
    const toast = document.getElementById('tryItToast');
    toast.opened = true;
  }

  _serverHandler(e) {
    const { value, type } = e.detail;
    this.serverType = type;
    this.serverValue = value;
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
      server,
      baseUri,
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the API method documentation element with various
        configuration options.
      </p>

      ${this._serverSelectorTemplate()}

      <arc-interactive-demo
        .states="${demoStates}"
        @state-chanegd="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >

        <div slot="content">
          <api-method-documentation
            .amf="${amf}"
            .baseUri="${baseUri}"
            .server="${server}"
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

  /**
   * @return {object} A template for the server selector
   */
  _serverSelectorTemplate() {
    const {
      amf,
      serverType,
      serverValue,
      compatibility,
    } = this;
    return html`
    <api-server-selector
      .amf="${amf}"
      .value="${serverValue}"
      .type="${serverType}"
      autoselect
      allowCustom
      ?compatibility="${compatibility}"
      @apiserverchanged="${this._serverHandler}"
    ></api-server-selector>`;
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
