import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AuroraCardConfig } from '../utils/hass-connect';

@customElement('aurora-empty-column-card')
export class AuroraEmptyColumnCard extends LitElement {
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    return html`<div class="empty-column"></div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .empty-column {
      min-height: 1px;
      width: 100%;
      background: transparent;
    }
  `;
}