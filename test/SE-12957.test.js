import { fixture, assert, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-method-documentation.js';

describe('SE-12957', function() {
  async function modelFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  const apiFile = 'SE-12957';

  [
    ['Compact model V1', true],
    ['Regular model V1', false]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      let amf;
      let element;
      before(async () => {
        amf = await AmfLoader.load(apiFile, compact);
        const endpopint = AmfLoader.lookupEndpoint(amf, '/api/v1/alarm/{scada-object-key}');
        const method = AmfLoader.lookupOperation(amf, '/api/v1/alarm/{scada-object-key}', 'get');
        element = await modelFixture(amf, endpopint, method);
      });

      it('renders parameters document', async () => {
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.ok(node);
      });

      it('parameters documentation computed queryParameters', () => {
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.typeOf(node.queryParameters, 'array');
        assert.lengthOf(node.queryParameters, 1);
        assert.isTrue(element.hasParameters);
      });

      it('parameters documentation computed endpointParameters', () => {
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.typeOf(node.endpointParameters, 'array');
        assert.lengthOf(node.endpointParameters, 1);
      });
    });
  });
});
