import { CSSResult, LitElement, TemplateResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

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
export declare class ApiUrl extends AmfHelperMixin(LitElement) {
  /**
   * AMF model for Server object
   */
  server: any;
  /**
   * AMF model for Endpoint object
   */
  endpoint: any;
  /**
   * AMF model for Operation object
   */
  operation: any;
  /**
   * Optional parameter to be injected into the URL
   * @attribute
   */
  apiVersion: string;
  /**
   * Optional override of the URL. If this property is set, then that will
   * be the base URI regardless of server and endpoint
   * @attribute
   */
  baseUri: string;
  _url: string;
  _method: string;
  _protocol: string;
  _protocolVersion: string;
  _operation: any;
  _server: any;

  get styles(): CSSResult;

  get isNotHttp(): boolean;

  get path(): string;

  get url(): string;

  render(): TemplateResult;

  _getMethodTemplate(): TemplateResult;

  _getPathTemplate(): TemplateResult|string;

  getUrlTemplate(): TemplateResult;

  _updateMethod(): void;

  _updateProtocol(): void;

  _updateProtocolVersion(): void;

  _updateUrl(): void;

  /**
   * Computes value for `httpMethod` property.
   *
   * @param operation AMF `supportedOperation` model
   * @returns HTTP method name
   */
  _computeMethod(operation: any): string|undefined;

  _dispatchChangeEvent(): void;
}
