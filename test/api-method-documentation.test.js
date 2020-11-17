import { fixture, assert, html, aTimeout, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { AmfLoader } from './amf-loader.js';
import '../api-method-documentation.js';

describe('<api-method-documentation>', function() {
  async function basicFixture() {
    return (await fixture(`<api-method-documentation></api-method-documentation>`));
  }

  async function modelFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  async function awareFixture() {
    return (await fixture(`<api-method-documentation aware="test"></api-method-documentation>`));
  }

  async function noTryitFixture() {
    return (await fixture(`<api-method-documentation notryit></api-method-documentation>`));
  }

  async function baseUriFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      baseuri="https://domain.com"
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  async function renderSecurityFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      rendersecurity
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  async function codeSnippetsFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      rendercodesnippets
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  async function noNavigationFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      noNavigation
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  describe('Basic tests', () => {
    it('Adds raml-aware to the DOM if aware is set', async () => {
      const element = await awareFixture();
      const node = element.shadowRoot.querySelector('raml-aware');
      assert.ok(node);
    });

    it('passes AMF model', async () => {
      const element = await awareFixture();
      const aware = document.createElement('raml-aware');
      aware.scope = 'test';
      aware.api = [{}];
      assert.deepEqual(element.amf, [{}]);
    });

    it('raml-aware is not in the DOM by default', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('raml-aware');
      assert.notOk(node);
    });

    it('api-annotation-document is not in the DOM', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('api-annotation-document');
      assert.notOk(node);
    });

    it('arc-marked is not in the DOM by default', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('arc-marked');
      assert.notOk(node);
    });

    it('api-headers-document is not in the DOM', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('api-headers-document');
      assert.notOk(node);
    });

    it('api-body-document is not in the DOM', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('api-body-document');
      assert.notOk(node);
    });

    it('api-parameters-document is not in the DOM', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('api-parameters-document');
      assert.notOk(node);
    });

    it('api-responses-document is not in the DOM', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('api-responses-document');
      assert.notOk(node);
    });

    it('Try it button is in the DOM', async () => {
      const element = await basicFixture();
      const button = element.shadowRoot.querySelector('.action-button');
      assert.ok(button);
    });

    it('Try it button click dispatches event', async () => {
      const element = await basicFixture();
      element.method = {
        '@id': 'test'
      };
      const spy = sinon.spy();
      element.addEventListener('tryit-requested', spy);
      const button = element.shadowRoot.querySelector('.action-button');
      MockInteractions.tap(button);
      const e = spy.args[0][0];
      assert.isTrue(e.bubbles);
      assert.equal(e.detail.id, 'test');
    });

    it('Try it is not in the DOM when notryit is set', async () => {
      const element = await noTryitFixture();
      const node = element.shadowRoot.querySelector('.action-button');
      assert.notOk(node);
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await basicFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  describe('Bottom navigation', () => {
    const prev = { 'label': 'p', 'id': 'pp' };
    const next = { 'label': 'n', 'id': 'nn' };

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('does not render bottom navigation when no params', () => {
      const node = element.shadowRoot.querySelector('.bottom-nav');
      assert.notOk(node);
    });

    it('renders bottom navigation', async () => {
      element.next = next;
      element.previous = prev;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.bottom-nav');
      assert.ok(node);
    });

    it('Renders previous buttons', async () => {
      element.previous = prev;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.bottom-link.previous');
      assert.ok(node);
    });

    it('Renders next buttons', async () => {
      element.next = next;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.bottom-link.next');
      assert.ok(node);
    });

    it('Does not render previous for next only', async () => {
      element.next = next;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.bottom-link.previous');
      assert.notOk(node);
    });

    it('Does not render next for previous only', async () => {
      element.previous = prev;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.bottom-link.next');
      assert.notOk(node);
    });

    it('_navigatePrevious() calls _navigate()', async () => {
      element.previous = prev;
      await nextFrame();
      const spy = sinon.spy(element, '_navigate');
      element._navigatePrevious();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], prev.id, 'ID argument is set');
      assert.equal(spy.args[0][1], 'method', 'method argument is set');
    });

    it('_navigateNext() calls _navigate()', async () => {
      element.next = next;
      await nextFrame();
      const spy = sinon.spy(element, '_navigate');
      element._navigateNext();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], next.id);
      assert.equal(spy.args[0][1], 'method');
    });
  });

  describe('_navigate()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Disaptches api-navigation-selection-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('api-navigation-selection-changed', spy);
      element._navigate('test-id', 'method');
      assert.isTrue(spy.called);
    });

    it('Event has selected property', () => {
      const spy = sinon.spy();
      element.addEventListener('api-navigation-selection-changed', spy);
      element._navigate('test-id', 'method');
      assert.equal(spy.args[0][0].detail.selected, 'test-id');
    });

    it('Event has type property', () => {
      const spy = sinon.spy();
      element.addEventListener('api-navigation-selection-changed', spy);
      element._navigate('test-id', 'method');
      assert.equal(spy.args[0][0].detail.type, 'method');
    });

    it('Event bubbles', () => {
      const spy = sinon.spy();
      element.addEventListener('api-navigation-selection-changed', spy);
      element._navigate('test-id', 'method');
      assert.isTrue(spy.args[0][0].bubbles);
    });

    it('Event is composed', () => {
      const spy = sinon.spy();
      element.addEventListener('api-navigation-selection-changed', spy);
      element._navigate('test-id', 'method');
      const composed = spy.args[0][0].bubbles;
      if (composed !== undefined) { // Edge
        assert.isTrue(composed);
      }
    });
  });

  describe('_titleHidden', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns false when with try it button', () => {
      element.methodName = 'test';
      element.httpMethod = 'other';
      assert.isFalse(element._titleHidden);
    });

    it('returns false when "noTryIt"', () => {
      element.noTryIt = true;
      element.methodName = 'test';
      element.httpMethod = 'other';
      assert.isFalse(element._titleHidden);
    });

    it('returns true when names are equal', () => {
      element.noTryIt = true;
      element.methodName = 'test';
      element.httpMethod = 'test';
      assert.isTrue(element._titleHidden);
    });

    it('returns true when no method name methodName', () => {
      element.noTryIt = true;
      element.methodName = '';
      element.httpMethod = 'test';
      assert.isTrue(element._titleHidden);
    });

    it('returns true when no method name httpMethod', () => {
      element.noTryIt = true;
      element.methodName = 'test';
      element.httpMethod = '';
      assert.isTrue(element._titleHidden);
    });
  });

  [
    ['Compact model', true],
    ['Full model', false]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      const demoApi = 'demo-api';
      const driveApi = 'google-drive-api';
      const callbacksApi = 'oas-callbacks';
      const asyncApi = 'async-api';

      describe('Basic AMF computations', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
          element = await modelFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout();
        });

        it('methodName is computed', () => {
          assert.equal(element.methodName, 'List people');
        });

        it('httpMethod is computed', () => {
          assert.equal(element.httpMethod, 'GET');
        });

        it('endpointUri is computed', () => {
          assert.equal(element.endpointUri, 'http://{instance}.domain.com/v1/people');
        });

        it('description is computed', () => {
          assert.typeOf(element.description, 'string');
        });

        it('hasCustomProperties is computed', () => {
          assert.isTrue(element.hasCustomProperties);
        });

        it('expects is computed', () => {
          assert.typeOf(element.expects, 'object');
        });

        it('server is computed', () => {
          assert.typeOf(element.server, 'object');
        });

        it('serverVariables is computed', () => {
          assert.typeOf(element.serverVariables, 'array');
        });

        it('endpointVariables is not computed', () => {
          assert.isUndefined(element.endpointVariables);
        });

        it('hasPathParameters is true', () => {
          assert.isTrue(element.hasPathParameters);
        });

        it('queryParameters is computed', () => {
          assert.typeOf(element.queryParameters, 'array');
        });

        it('hasParameters is true', () => {
          assert.isTrue(element.hasParameters);
        });

        it('headers is computed', () => {
          assert.typeOf(element.headers, 'array');
        });

        it('returns is computed', () => {
          assert.typeOf(element.returns, 'array');
        });
      });

      describe('Payload related computations', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people/{personId}', 'put');
          element = await modelFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout();
        });

        it('endpointVariables is computed', () => {
          assert.typeOf(element.endpointVariables, 'array');
        });

        it('payload is computed', () => {
          assert.typeOf(element.payload, 'array');
        });

        it('renders api-body-document', () => {
          const node = element.shadowRoot.querySelector('api-body-document');
          assert.ok(node);
        });
      });

      describe('Changing selection', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [prevEndpoint, prevMethod] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
          element = await modelFixture(amf, prevEndpoint, prevMethod);
          // model change debouncer
          await aTimeout();
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/products', 'post');
          element.endpoint = endpoint;
          element.method = method;
          await aTimeout();
        });

        it('methodName is computed', () => {
          assert.equal(element.methodName, 'Create product');
        });

        it('httpMethod is computed', () => {
          assert.equal(element.httpMethod, 'POST');
        });

        it('endpointUri is computed', () => {
          assert.equal(element.endpointUri, 'http://{instance}.domain.com/v1/products');
        });

        it('description is computed', () => {
          assert.typeOf(element.description, 'string');
        });
      });

      describe('DOM content', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [prevEndpoint, prevMethod] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
          element = await modelFixture(amf, prevEndpoint, prevMethod);
          await aTimeout();
        });

        it('method-name label is rendered', () => {
          const node = element.shadowRoot.querySelector('.title');
          assert.ok(node);
          assert.equal(node.innerText.toLowerCase(), 'list people');
        });

        it('api-annotation-document is rendered', () => {
          const node = element.shadowRoot.querySelector('api-annotation-document');
          assert.ok(node);
        });

        it('renders arc-marked', () => {
          const node = element.shadowRoot.querySelector('arc-marked');
          assert.ok(node);
        });

        it('api-headers-document is rendered', () => {
          const node = element.shadowRoot.querySelector('api-headers-document');
          assert.ok(node);
        });

        it('api-parameters-document is rendered', () => {
          const node = element.shadowRoot.querySelector('api-parameters-document');
          assert.ok(node);
        });

        it('api-body-document is not rendered', () => {
          const node = element.shadowRoot.querySelector('api-body-document');
          assert.notOk(node);
        });

        it('api-responses-document is rendered', () => {
          const node = element.shadowRoot.querySelector('api-responses-document');
          assert.ok(node);
        });
      });

      describe('Base URI property', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let endpoint;
        let method;

        describe('method with no queryParameters', () => {
          beforeEach(() => {
            [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people/{personId}', 'put');
          });

          it('sets URL from base uri', async () => {
            const element = await baseUriFixture(amf, endpoint, method);
            await aTimeout();
            assert.equal(element.endpointUri, 'https://domain.com/people/{personId}');
          });
        })

        describe('method with string queryParameter', () => {
          beforeEach(() => {
            [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/mail', 'get');
          });

          it('sets URL from base uri', async () => {
            const element = await baseUriFixture(amf, endpoint, method);
            await aTimeout();
            assert.equal(element.endpointUri, 'https://domain.com/mail?box=foo');
          });
        })

        describe('method with array queryParameter', () => {
          beforeEach(() => {
            [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/test-parameters/{feature}', 'get');
          });

          it('sets URL from base uri', async () => {
            const element = await baseUriFixture(amf, endpoint, method);
            await aTimeout();
            const expectedUri =
              'https://domain.com/test-parameters/{feature}' +
              '?testRepeatable=value1&testRepeatable=value2&numericRepeatable=123&numericRepeatable=456'
            assert.equal(element.endpointUri, expectedUri);
          });
        })
      });

      describe('Code snippets', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
          element = await codeSnippetsFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout();
        });

        it('renders snippets section', async () => {
          const node = element.shadowRoot.querySelector('.snippets');
          assert.ok(node);
        });

        it('sets _renderSnippets when opening snippets', async () => {
          const button = element.shadowRoot.querySelector('.snippets .title-area-actions anypoint-button');
          MockInteractions.tap(button);
          assert.isTrue(element._renderSnippets);
        });

        it('eventually sets _snippetsOpened', async () => {
          const button = element.shadowRoot.querySelector('.snippets .title-area-actions anypoint-button');
          MockInteractions.tap(button);
          await aTimeout();
          assert.isTrue(element._snippetsOpened);
        });

        it('renders code snippets', async () => {
          const button = element.shadowRoot.querySelector('.snippets .title-area-actions anypoint-button');
          MockInteractions.tap(button);
          await aTimeout();
          const node = element.shadowRoot.querySelector('http-code-snippets');
          assert.ok(node);
        });

        it('_computeSnippetsHeaders() returns a value', () => {
          const result = element._computeSnippetsHeaders(element.headers);
          assert.equal(result, 'x-people-op-id: 9719fa6f-c666-48e0-a191-290890760b30\n');
        });
      });

      describe('_computeSnippetsPayload()', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          element = await codeSnippetsFixture(amf);
        });

        it('uses first payload in array', () => {
          const payload = AmfLoader.lookupPayload(amf, '/people', 'post');
          const result = element._computeSnippetsPayload(payload);
          assert.typeOf(result, 'string');
        });

        it('Computes example for JSON value', () => {
          const payload = AmfLoader.lookupPayload(amf, '/people', 'post');
          const result = element._computeSnippetsPayload(payload[0]);
          assert.equal(result,
            '{\n  "etag": "",\n  "tagline": "",\n  "name": "John Smith",\n  "url": ' +
            '"",\n  "id": "",\n  "language": "",\n  "birthday": "",\n  "image": {\n    ' +
            '"url": "https://domain.com/profile/pawel.psztyc/image",\n    ' +
            '"thumb": "https://domain.com/profile/pawel.psztyc/image/thumb"\n  },\n  "gender": ""\n}');
        });

        it('Computes example for XML value', () => {
          const payload = AmfLoader.lookupPayload(amf, '/people', 'post');
          const result = element._computeSnippetsPayload(payload[1]);
          assert.equal(result,
            '<?xml version="1.0" encoding="UTF-8"?>\n<resource error="false" type="AppPerson">\n  ' +
            '<id>Qawer63J73HJ6khjswuqyq62382jG21s</id>\n  <name>John Smith</name>\n  ' +
            '<birthday>1990-10-12</birthday>\n  <gender>male</gender>\n  ' +
            '<url>https://www.domain.com/people/Qawer63J73HJ6khjswuqyq62382jG21s</url>\n  <image>\n    ' +
            '<url>https://www.domain.com/people/Qawer63J73HJ6khjswuqyq62382jG21s/image</url>\n    ' +
            '<thumb>https://www.domain.com/people/Qawer63J73HJ6khjswuqyq62382jG21s/image/thumb</thumb>\n  ' +
            '</image>\n  <tagline>Hi, I\'m John!</tagline>\n  <language>en_US</language>\n</resource>\n');
        });

        it('Uses application/json as default media type', () => {
          const payload = AmfLoader.lookupPayload(amf, '/people', 'post')[0];
          const key = element._getAmfKey(element.ns.raml.vocabularies.http + 'mediaType');
          delete payload[key];
          const result = element._computeSnippetsPayload(payload);
          assert.equal(result,
            '{\n  "etag": "",\n  "tagline": "",\n  "name": "John Smith",\n  "url": ' +
            '"",\n  "id": "",\n  "language": "",\n  "birthday": "",\n  "image": {\n    ' +
            '"url": "https://domain.com/profile/pawel.psztyc/image",\n    ' +
            '"thumb": "https://domain.com/profile/pawel.psztyc/image/thumb"\n  },\n  "gender": ""\n}');
        });

        it('Returns undefined for empty argument', () => {
          const result = element._computeSnippetsPayload();
          assert.isUndefined(result);
        });
      });

      describe('Security documentation', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people/{personId}', 'get');
          element = await renderSecurityFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout();
        });

        it('computes security', () => {
          assert.typeOf(element.security, 'array');
          assert.lengthOf(element.security, 2);
        });

        it('renders security section', () => {
          const section = element.shadowRoot.querySelector('.security');
          assert.ok(section);
        });

        it('toggle button toggles the state', () => {
          const section = element.shadowRoot.querySelector('.security .section-title-area');
          MockInteractions.tap(section);
          assert.isTrue(element.securityOpened);
        });
      });

      describe('Traits computation', () => {
        let amf;
        let element;
        before(async () => {
          amf = await AmfLoader.load(driveApi, compact);
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/files', 'post');
          element = await renderSecurityFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout();
        });

        it('renders traits section', () => {
          const section = element.shadowRoot.querySelector('.extensions');
          assert.ok(section);
        });

        it('computes traits property', () => {
          assert.typeOf(element.traits, 'array');
        });

        it('render names', () => {
          const label = element.shadowRoot.querySelector('.extensions .trait-name');
          assert.equal(label.textContent.trim(), 'file and visibility');
        });
      });

      describe('No navigation', () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(demoApi, compact);
        });

        let element;
        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
          element = await noNavigationFixture(amf, endpoint, method);
          await aTimeout();
        });

        it('does not render navigation', () => {
          const node = element.shadowRoot.querySelector('.bottom-nav');
          assert.notOk(node);
        });
      });

      describe('Callbacks basic computations', () => {
        let amf;
        let element;
        before(async () => {
          amf = await AmfLoader.load(callbacksApi, compact);
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, '/subscribe', 'post');
          element = await modelFixture(amf, endpoint, method);
          await aTimeout();
        });

        it('computes callbacks property', () => {
          assert.typeOf(element.callbacks, 'array', 'callbacks are computed');
          assert.lengthOf(element.callbacks, 3, 'has 3 callbacks');
        });

        it('renders callbacks section', () => {
          const node = element.shadowRoot.querySelector('.callbacks');
          assert.ok(node);
        });

        it('callbacks section is collapsed by default', () => {
          assert.isFalse(element.callbacksOpened);
        });

        it('callbacks section can be opened with a click', async () => {
          const node = element.shadowRoot.querySelector('.callbacks .section-title-area');
          MockInteractions.tap(node);
          await nextFrame();
          assert.isTrue(element.callbacksOpened);
        });

        it('toggle section button has SHOW label by default', () => {
          const node = element.shadowRoot.querySelector('.callbacks .title-area-actions .toggle-button');
          assert.equal(node.textContent.trim(), 'Hide');
        });

        it('toggle section button has HIDE label when opened', async () => {
          element.callbacksOpened = true;
          await nextFrame();
          const node = element.shadowRoot.querySelector('.callbacks .title-area-actions .toggle-button');
          assert.equal(node.textContent.trim(), 'Hide');
        });

        it('renders all defiend callback sections', () => {
          const nodes = element.shadowRoot.querySelectorAll('.callback-section');
          assert.lengthOf(nodes, 3);
        });

        it('renders callback section title', () => {
          const nodes = element.shadowRoot.querySelectorAll('.callback-section .table-title');
          assert.equal(nodes[0].textContent.trim(), 'inProgress');
          assert.equal(nodes[1].textContent.trim(), 'inProgress');
          assert.equal(nodes[2].textContent.trim(), 'inProgress');
        });

        it('each section has method documentation', () => {
          const nodes = element.shadowRoot.querySelectorAll('.callback-section api-method-documentation');
          assert.lengthOf(nodes, 3);
        });

        it('method documentation as set configuration', () => {
          const node = element.shadowRoot.querySelector('.callback-section api-method-documentation');
          assert.isTrue(node.noTryIt, 'notryit is set');
          assert.isTrue(node.narrow, 'narrow is set');
          assert.isTrue(node.noNavigation, 'nonavigation is set');
          assert.isTrue(node.noNavigation, 'nonavigation is set');
          assert.isTrue(node.ignoreBaseUri, 'ignorebaseuri is set');
        });

        it('should render operationId', () => {
          const operationIdNode = element.shadowRoot.querySelector('.operation-id');
          assert.exists(operationIdNode);
          assert.equal(operationIdNode.textContent, 'Operation ID: subscribeOperation');
        });
      });
    
      describe('Non-http protocols', () => {
        let amf;
        let element;

        before(async () => {
          amf = await AmfLoader.load(asyncApi, compact);
        });

        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, 'hello', 'publish');
          element = await modelFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout(0);
        });

        it('should set endpoint uri with amqp protocol', () => {
          assert.equal(element.endpointUri, 'amqp://broker.mycompany.com');
        });

        it('isNonHttpProtocol() should return true', () => {
          element.noTryIt = false;
          assert.isTrue(element.isNonHttpProtocol());
        });
      });

      describe('AsyncAPI', () => {
        let amf;
        let element;

        before(async () => {
          amf = await AmfLoader.load(asyncApi, compact);
        });

        beforeEach(async () => {
          const [endpoint, method] = AmfLoader.lookupEndpointOperation(amf, 'hello', 'publish');
          element = await modelFixture(amf, endpoint, method);
          // model change debouncer
          await aTimeout(0);
        });

        it('should set security when security is defined in server node', () => {
          assert.lengthOf(element.security, 2);
        });
      });
    });
  });
});
