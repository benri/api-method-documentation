import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-url.js';

describe('<api-url>', function () {
  async function basicFixture() {
	return fixture(`<api-url></api-url>`);
  }

  async function operationFixture({ amf, endpoint, operation, server }) {
	return fixture(html`<api-url
      .amf="${amf}"
      .endpoint="${endpoint}"
      .operation="${operation}"
      .server="${server}"
    >
    </api-url>`);
  }

  describe('Basic tests', () => {
	it('should render baseUri if set', async () => {
	  const element = await basicFixture();
	  element.baseUri = 'http://example.org';
	  await nextFrame();
	  assert.equal(element.url, 'http://example.org');
	  assert.equal(element.shadowRoot.querySelector('.url-value').textContent, 'http://example.org');
	});
  });

  [
	['Compact model', true],
	['Full model', false]
  ].forEach(([label, compact]) => {
	describe(label, () => {
	  const demoApi = 'demo-api';
	  const asyncApi = 'async-api';

	  describe('Basic AMF computations', () => {
		let amf;
		let element;
		let server;

		before(async () => {
		  amf = await AmfLoader.load(demoApi, compact);
		});

		beforeEach(async () => {
		  const [endpoint, operation] = AmfLoader.lookupEndpointOperation(amf, '/people', 'get');
		  element = await basicFixture();
		  element.amf = amf;
		  server = AmfLoader.getEncodes(amf)[element._getAmfKey(element.ns.aml.vocabularies.apiContract.server)];
		  if (Array.isArray(server)) {
			server = server[0];
		  }
		  element = await operationFixture({ amf, endpoint, operation, server });
		  // model change debouncer
		  await nextFrame();
		});

		it('should compute path', () => {
		  assert.equal(element.path, '/people');
		});

		it('should compute url', () => {
		  assert.equal(element.url, 'http://{instance}.domain.com/{version}/people');
		});

		it('should compute method', () => {
		  assert.equal(element._method, 'GET');
		});

		it('should render method', () => {
		  assert.exists(element.shadowRoot.querySelector('.method-value'));
		});

		it('should not render method if method is not present', async () => {
		  element.operation = null;
		  await nextFrame();
		  assert.notExists(element.shadowRoot.querySelector('.method-value'));
		});
	  });

	  describe('AsyncAPI', () => {
		let amf;
		let element;
		let server;

		before(async () => {
		  amf = await AmfLoader.load(asyncApi, compact);
		});

		beforeEach(async () => {
		  const [endpoint, operation] = AmfLoader.lookupEndpointOperation(amf, 'hello', 'publish');
		  element = await basicFixture();
		  element.amf = amf;
		  server = AmfLoader.getEncodes(amf)[element._getAmfKey(element.ns.aml.vocabularies.apiContract.server)];
		  if (Array.isArray(server)) {
			server = server[0];
		  }
		  element = await operationFixture({ amf, endpoint, operation, server });
		  // model change debouncer
		  await nextFrame();
		});

		it('should compute path', () => {
		  assert.equal(element.path, 'hello');
		});

		it('should compute url without path', () => {
		  assert.equal(element.url, 'amqp://broker.mycompany.com');
		});

		it('should compute method', () => {
		  assert.equal(element._method, 'PUBLISH');
		});
	  });
	});
  });
});
