import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-method-documentation.js';

describe('SE-12752 - query string', function() {
  async function modelFixture(amf, endpoint, method) {
    return (await fixture(html`<api-method-documentation
      .amf="${amf}"
      .endpoint="${endpoint}"
      .method="${method}"></api-method-documentation>`));
  }

  const apiFile = 'SE-12752';

  [
    ['Compact model', true],
    ['Regular model', false]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      let amf;
      let element;
      before(async () => {
        amf = await AmfLoader.load(apiFile, compact);
      });

      it('renders parameters table with query parameters as a NodeShape', async () => {
        const endpoint = AmfLoader.lookupEndpoint(amf, '/test');
        const method = AmfLoader.lookupOperation(amf, '/test', 'get');
        element = await modelFixture(amf, endpoint, method);
        await aTimeout();
        const qp = element.queryParameters;
        assert.typeOf(qp, 'object', 'queryParameters is computed');
        const isNodeShape = element._hasType(qp, element.ns.w3.shacl.NodeShape);
        assert.isTrue(isNodeShape, 'queryParameters is a NodeShape');
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.ok(node, 'document is rendered');
        assert.isTrue(element.hasParameters);
      });

      it('renders parameters table with query parameters as an ArrayShape', async () => {
        const endpoint = AmfLoader.lookupEndpoint(amf, '/array');
        const method = AmfLoader.lookupOperation(amf, '/array', 'get');
        element = await modelFixture(amf, endpoint, method);
        await aTimeout();
        const qp = element.queryParameters;
        assert.typeOf(qp, 'object', 'queryParameters is computed');
        const isNodeShape = element._hasType(qp, element.ns.aml.vocabularies.shapes.ArrayShape);
        assert.isTrue(isNodeShape, 'queryParameters is an ArrayShape');
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.ok(node, 'document is rendered');
        assert.isTrue(element.hasParameters);
      });

      it('renders parameters table with query parameters as an UnionShape', async () => {
        const endpoint = AmfLoader.lookupEndpoint(amf, '/union');
        const method = AmfLoader.lookupOperation(amf, '/union', 'get');
        element = await modelFixture(amf, endpoint, method);
        await aTimeout();
        const qp = element.queryParameters;
        assert.typeOf(qp, 'object', 'queryParameters is computed');
        const isNodeShape = element._hasType(qp, element.ns.aml.vocabularies.shapes.UnionShape);
        assert.isTrue(isNodeShape, 'queryParameters is an UnionShape');
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.ok(node, 'document is rendered');
        assert.isTrue(element.hasParameters);
      });

      it('renders parameters table with query parameters as an ScalarShape', async () => {
        const endpoint = AmfLoader.lookupEndpoint(amf, '/scalar');
        const method = AmfLoader.lookupOperation(amf, '/scalar', 'get');
        element = await modelFixture(amf, endpoint, method);
        await aTimeout();
        const qp = element.queryParameters;
        assert.typeOf(qp, 'object', 'queryParameters is computed');
        const isScalarShape = element._hasType(qp, element.ns.aml.vocabularies.shapes.ScalarShape);
        assert.isTrue(isScalarShape, 'queryParameters is an ScalarShape');
        const node = element.shadowRoot.querySelector('api-parameters-document');
        assert.ok(node, 'document is rendered');
        assert.isTrue(element.hasParameters);
      });
    });
  });
});
