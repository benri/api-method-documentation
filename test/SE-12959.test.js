import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-method-documentation.js';

describe.only('SE-12959', function() {
  async function modelFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  const apiFile = 'SE-12959';

  [
    ['Compact model V1', true],
    ['Regular model V1', false]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      let amf;
      let element;
      before(async () => {
        amf = await AmfLoader.load(apiFile, compact);
      });

      it('methodSummary has no value by default', async () => {
        const endpopint = AmfLoader.lookupEndpoint(amf, '/api/v1/alarm/{scada-object-key}');
        const method = AmfLoader.lookupOperation(amf, '/api/v1/alarm/{scada-object-key}', 'get');
        element = await modelFixture(amf, endpopint, method);
        await aTimeout();
        assert.isUndefined(element.methodSummary);
      });

      it('methodSummary has value when OAS summary', async () => {
        const endpopint = AmfLoader.lookupEndpoint(amf, '/api/v1/downtime/site/{site-api-key}');
        const method = AmfLoader.lookupOperation(amf, '/api/v1/downtime/site/{site-api-key}', 'get');
        element = await modelFixture(amf, endpopint, method);
        await aTimeout();
        assert.equal(element.methodSummary, 'Get a list of downtime events for a site that overlap with a time period');
      });

      it('renders the summary', async () => {
        const endpopint = AmfLoader.lookupEndpoint(amf, '/api/v1/downtime/site/{site-api-key}');
        const method = AmfLoader.lookupOperation(amf, '/api/v1/downtime/site/{site-api-key}', 'get');
        element = await modelFixture(amf, endpopint, method);
        await aTimeout();
        const node = element.shadowRoot.querySelector('.summary');
        assert.ok(node);
      });
    });
  });
});
