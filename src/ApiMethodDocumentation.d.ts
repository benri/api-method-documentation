import { CSSResult, LitElement, TemplateResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/**
 * `api-method-documentation`
 *
 * Renders documentation for a method for an endpoint.
 *
 * This element works with [AMF](https://github.com/mulesoft/amf) data model.
 * To properly compute all the information relevant to method documentation
 * set the following properties:
 *
 * - amf - as AMF's WebApi data model
 * - endpoint - As AMF's EndPoint data model
 * - method - As AMF's SupportedOperation property
 *
 * When set, this will automatically populate the view with data.
 * 
 * @fires tryit-requested
 * @fires api-navigation-selection-changed
 */
export declare class ApiMethodDocumentation extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;
  /**
   * AMF method definition as a `http://www.w3.org/ns/hydra/core#supportedOperation`
   * object.
   */
  method: any;
  /**
   * Method's endpoint definition as a
   * `http://raml.org/vocabularies/http#endpoint` of AMF model.
   */
  endpoint: any;
  /**
   * The try it button is not rendered when set.
   * @attribute
   */
  noTryIt: boolean;
  /**
   * Computed value from the method model, name of the method.
   * It is either a `displayName` or HTTP method name
   * @attribute
   */
  methodName: string;
  /**
   * HTTP method name string.
   *
   * It is computed from `endpoint`.
   * @attribute
   */
  httpMethod: string;
  /**
   * A property to set to override AMF's model base URI information.
   * When this property is set, the `endpointUri` property is recalculated.
   * @attribute
   */
  baseUri: string;
  /**
   * Computed value, API version name
   * @attribute
   */
  apiVersion: string;
  /**
   * Endpoint URI to display in main URL field.
   * This value is computed when `amf`, `endpoint` or `baseUri` change.
   * @attribute
   */
  endpointUri: string;
  /**
   * Computed value of method description from `method` property.
   * @attribute
   */
  description: string;
  /**
   * Computed value from current `method`. True if the model contains
   * custom properties (annotations in RAML).
   * @attribute
   */
  hasCustomProperties: boolean;
  /**
   * Computed value of `http://www.w3.org/ns/hydra/core#expects`
   * of AMF model from current `method`
   */
  expects: any;
  /**
   * Computed value of the `http://raml.org/vocabularies/http#server`
   * from `amf`
   */
  server: any;
  /**
   * API base URI parameters defined in AMF api model
   */
  serverVariables: any[];
  /**
   * Endpoint's path parameters.
   */
  endpointVariables: any[];
  /**
   * Computed value if server and endpoint definition of API model has
   * defined any variables.
   * @attribute
   */
  hasPathParameters: boolean;
  /**
   * Computed value of method's query parameters.
   */
  queryParameters: any[];
  /**
   * Computed value, true when either has path or query parameters.
   * This renders `api-parameters-document` if true.
   * @attribute
   */
  hasParameters: boolean;
  /**
   * Computed value of AMF payload definition from `expects`
   * property.
   */
  payload: any[];
  /**
   * Computed value of AMF payload definition from `expects`
   * property.
   */
  headers: any[];
  /**
   * Computed value of AMF response definition from `returns`
   * property.
   */
  returns: any[];
  /**
   * Computed value of AMF security definition from `method`
   * property.
   */
  security: any[];
  /**
   * If set it will renders the view in the narrow layout.
   * @attribute
   */
  narrow: boolean;
  /**
   * Model to generate a link to previous HTTP method.
   * It should contain `id` and `label` properties
   */
  previous: any;
  /**
   * Model to generate a link to next HTTP method.
   * It should contain `id` and `label` properties
   */
  next: any;
  /**
   * When set code snippets are rendered.
   */
  _snippetsOpened: boolean;
  /**
   * When set security details are rendered.
   * @attribute
   */
  securityOpened: boolean;
  /**
   * Whether or not the callbacks toggle is opened.
   * @attribute
   */
  callbacksOpened: boolean;
  /**
   * When set it renders code examples section is the documentation
   * @attribute
   */
  renderCodeSnippets: boolean;
  /**
   * When set it renders security documentation when applicable
   * @attribute
   */
  renderSecurity: boolean;
  /**
   * List of traits and resource types, if any.
   */
  extendsTypes: any[];
  /**
   * List of traits applied to this endpoint
   */
  traits: any[];
  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * When enabled it renders external types as links and dispatches
   * `api-navigation-selection-changed` when clicked.
   * @attribute
   */
  graph: boolean;
  /**
   * OAS summary field.
   * @attribute
   */
  methodSummary: string;

  _renderSnippets: boolean;
  /**
   * When set it hides bottom navigation links
   * @attribute
   */
  noNavigation: boolean;
  /**
   * When set the base URI won't be rendered for this method.
   * @attribute
   */
  ignoreBaseUri: boolean;
  /**
   * Optional protocol for the current method
   * @attribute
   */
  protocol: string;

  get _titleHidden(): boolean;

  get snippetsUri(): string;

  constructor();

  __amfChanged(): void;

  _methodChanged(): void;

  _endpointChanged(): void;

  _processModelChange(): void;

  _processMethodChange(): void;

  _processEndpointChange(): void;

  _hasQueryParameters(): boolean;

  _expectsChanged(expects: any): void;

  _processEndpointVariables(): void;

  /**
   * Updates value for endpoint URI, server and path variables.
   */
  _processServerInfo(): void;

  /**
   * Computes list of query parameters to be rendered in the query parameters table.
   *
   * The parameters document can pass a type definition for query parameters
   * or a list of properties to be rendered without the parent type definition.
   *
   * @param scheme Model for Expects shape of AMF model.
   * @returns Either list of properties or a type definition for a queryString property of RAML's
   */
  _computeQueryParameters(scheme: any): any[]|any|undefined;

  /**
   * Computes value for `methodName` property.
   * It is either a `http://schema.org/name` or HTTP method name
   *
   * @param method AMF `supportedOperation` model
   * @returns Method friendly name
   */
  _computeMethodName(method: any): string|undefined;

  /**
   * Computes value for `hasPathParameters` property
   *
   * @param sVars Current value of `serverVariables` property
   * @param eVars Current value of `endpointVariables` property
   */
  _computeHasPathParameters(sVars: any[], eVars: any[]): boolean;

  /**
   * "Try it" button click handler. Dispatches `tryit-requested` custom event
   */
  _tryIt(): void;

  /**
   * Navigates to next method. Calls `_navigate` with id of previous item.
   */
  _navigatePrevious(): void;

  /**
   * Navigates to next method. Calls `_navigate` with id of next item.
   */
  _navigateNext(): void;

  /**
   * Dispatches `api-navigation-selection-changed` so other components
   * can update their state.
   */
  _navigate(id: string, type: string): void;

  /**
   * Toggles code snippets section.
   */
  _toggleSnippets(): void;

  _snippetsTransitionEnd(): void;

  /**
   * Toggles security section.
   */
  _toggleSecurity(): void;

  /**
   * Toggles security section.
   */
  _toggleCallbacks(): void;

  /**
   * Computes example headers string for code snippets.
   * @param headers Headers model from AMF
   * @returns Computed example value for headers
   */
  _computeSnippetsHeaders(headers: any|any[]): string|undefined;

  /**
   * Computes example payload string for code snippets.
   * @param payload Payload model from AMF
   * @returns Computed example value for payload
   */
  _computeSnippetsPayload(payload: object|object[]): string|undefined;

  /**
   * Tries to find an example value (whether it's default value or from an
   * example) to put it into snippet's values.
   *
   * @param item A http://raml.org/vocabularies/http#Parameter property
   */
  _computePropertyValue(item: object): string|undefined;

  /**
   * Computes a label for the section toggle buttons.
   */
  _computeToggleActionLabel(opened?: boolean): string;

  /**
   * Computes state of toggle button.
   */
  _computeToggleButtonState(opened?: boolean): string;

  /**
   * Computes class for the toggle's button icon.
   */
  _computeToggleIconClass(opened?: boolean): string;

  /**
   * Computes list of "extends" from the shape.
   *
   * @param shape AMF shape to get `#extends` model from
   */
  _computeExtends(shape: any): any[]|undefined;

  /**
   * Computes value for `traits` property
   *
   * @param types Result of calling `_computeExtends()` or a list of `#extends` models.
   */
  _computeTraits(types: any[]): any[]|undefined;

  /**
   * Computes list of trait names to render it in the doc.
   *
   * @param traits AMF trait definition
   * @returns Trait name if defined.
   */
  _computeTraitNames(traits: any[]): string|undefined;

  /**
   * Computes as list of OAS' callbacks in current method
   * @param method A method to process
   * @returns List of Callbacks or undefined if none.
   */
  _computeCallbacks(method: any): any[]|undefined;

  render(): TemplateResult;

  _getTitleTemplate(): TemplateResult|string;

  _getUrlTemplate(): TemplateResult;

  _getTraitsTemplate(): TemplateResult|string;

  _getDescriptionTemplate(): TemplateResult|string;

  _getCodeSnippetsTemplate(): TemplateResult|string;

  _getSecurityTemplate(): TemplateResult|string;

  _getParametersTemplate(): TemplateResult|string;

  _getHeadersTemplate(): TemplateResult|string;

  _getBodyTemplate(): TemplateResult|string;

  _getReturnsTemplate(): TemplateResult|string;

  _callbacksTemplate(): TemplateResult|string;

  _callbackTemplate(callback: any): TemplateResult|string;

  _handleUrlChange(event: CustomEvent): void;

  isNonHttpProtocol(): boolean;

  _getNavigationTemplate(): TemplateResult|string;

  _computeMethodParametersUri(method: any): TemplateResult|string;

  _computeMethodParameterUri(param: any): any;

  /**
   * Dispatched when the user requested the "Try it" view.
   * @event tryit-requested
   * @param {String} id ID of requested method in AMF model.
   * It might be required if the request for try it view comes from
   * a context where more than one method is rendered at the same time.
   */
  /**
   * Dispatched when the user requested previous / next
   *
   * @event api-navigation-selection-changed
   * @param {String} selected
   * @param {String} type
   */
}
