const AmfLoader = {};
AmfLoader.load = function(endpointIndex, methodIndex, compact) {
  endpointIndex = endpointIndex || 0;
  methodIndex = methodIndex || 0;

  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';

  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace(/\/test.*/, '/demo') + file;
  console.log(url);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      if (data instanceof Array) {
        data = data[0];
      }
      const encKey = compact ? 'doc:encodes' : 'http://a.ml/vocabularies/document#encodes';
      let def = data[encKey];
      if (def instanceof Array) {
        def = def[0];
      }
      const endKey = compact ? 'raml-http:endpoint' : 'http://a.ml/vocabularies/http#endpoint';
      const endpoint = def[endKey][endpointIndex];
      const opKey = compact ? 'hydra:supportedOperation' : 'http://www.w3.org/ns/hydra/core#supportedOperation';
      const method = endpoint[opKey][methodIndex];
      resolve([data, endpoint, method]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
