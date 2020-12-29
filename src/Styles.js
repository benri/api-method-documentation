import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

[hidden] {
  display: none !important;
}

.title {
  font-size: var(--arc-font-headline-font-size);
  letter-spacing: var(--arc-font-headline-letter-spacing);
  line-height: var(--arc-font-headline-line-height);
  font-weight: var(--api-method-documentation-title-method-font-weight,
    var(--arc-font-headline-font-weight, 500));
  text-transform: capitalize;
}

.heading2 {
  font-size: var(--arc-font-title-font-size);
  font-weight: var(--arc-font-title-font-weight);
  line-height: var(--arc-font-title-line-height);
  margin: 0.84em 0;
}

.heading3 {
  flex: 1;
  font-size: var(--arc-font-subhead-font-size);
  font-weight: var(--arc-font-subhead-font-weight);
  line-height: var(--arc-font-subhead-line-height);
}

.heading4 {
  flex: 1;
  font-weight: bold;
}

.title-area {
  flex-direction: row;
  display: flex;
  align-items: center;
}

:host([narrow]) .title-area {
  margin-bottom: 24px;
}

:host([narrow]) .title-area {
  margin-top: 12px;
}

:host([narrow]) .title {
  font-size: var(--arc-font-headline-narrow-font-size, 20px);
  margin: 0;
}

:host([narrow]) .heading2 {
  font-size: var(--arc-font-title-narrow-font-size, 18px);
}

:host([narrow]) .heading3 {
  font-size: var(--arc-font-subhead-narrow-font-size, 17px);
}

.title {
  flex: 1;
}

.url-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: var(--arc-font-code-family);
  font-size: var(--api-method-documentation-url-font-size, 1.07rem);
  margin-bottom: 40px;
  margin-top: 20px;
  background-color: var(--code-background-color);
  color: var(--code-color);
  padding: 8px;
  border-radius: var(--api-method-documentation-url-border-radius, 4px);
  position: relative;
}

.section-title-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px var(--api-parameters-document-title-border-color, #e5e5e5) solid;
  cursor: pointer;
  user-select: none;
  transition: border-bottom-color 0.15s ease-in-out;
}

.section-title-area[opened] {
  border-bottom-color: transparent;
}

.url-value {
  flex: 1;
  margin-left: 12px;
  word-break: break-all;
}

.channel-url, .server-url {
  display: block;
  font-size: var(--api-method-documentation-url-font-size, 0.70rem);
  font-weight: bolder;
}

.url-server-value {
  margin-top: 8px;
}

.method-value {
  text-transform: uppercase;
  white-space: nowrap;
}

.toggle-icon {
  margin-left: 8px;
  transform: rotateZ(0deg);
  transition: transform 0.3s ease-in-out;
}

.toggle-icon.opened {
  transform: rotateZ(-180deg);
}

http-code-snippets {
  margin-bottom: 40px;
}

.bottom.action {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
}

arc-marked {
  margin: 8px 0;
  padding: 0px;
}

.markdown-body {
  margin-bottom: 28px;
  color: var(--api-method-documentation-description-color, rgba(0, 0, 0, 0.74));
}

.summary {
  color: var(--api-method-documentation-description-color, rgba(0, 0, 0, 0.74));
  font-size: 1.1rem;
}

.operation-id {
  color: var(--api-method-documentation-operation-id-color, rgba(0, 0, 0, 0.61));
  font-size: 0.8rem;
}

.method-label {
  margin-bottom: 0;
}

.bottom-nav,
.bottom-link {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bottom-nav {
  padding: 32px 0;
  margin: 16px 0;
  border-top: 1px var(--api-method-documentation-bottom-navigation-border-color, #cfd8dc) solid;
  color: var(--api-method-documentation-bottom-navigation-color, #000);
}

.bottom-link {
  cursor: pointer;
  max-width: 50%;
  word-break: break-all;
  text-decoration: underline;
}

.bottom-link.previous {
  margin-right: 12px;
}

.bottom-link.next {
  margin-left: 12px;
}

.nav-separator {
  flex: 1;
}

api-security-documentation {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px var(--api-headers-document-title-border-color, #e5e5e5) dashed;
}

api-security-documentation:last-of-type {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.extensions {
  font-style: italic;
  margin: 12px 0;
}

.request-documentation,
.response-documentation {
  background-color: var(--api-method-documentation-section-background-color, initial);
  padding: var(--api-method-documentation-section-padding, 0px);
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.callback-section {
  margin: 12px 0;
  padding: 8px;
  background-color: var(--api-method-documentation-callback-background-color, #f7f7f7);
}`;
