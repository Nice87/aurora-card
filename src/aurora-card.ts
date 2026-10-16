import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig } from './utils/hass-connect';
import { evaluateVisibility } from './utils/visibility';
import { registerAuroraTheme } from './styles/theme-register';

import './editor/editor-base';
import './cards/button-card';
import './cards/separator-card';
import './cards/empty-column-card';
import './cards/pop-up-card';
import './cards/cover-card';
import './cards/climate-card';
import './cards/media-card';
import './cards/routine-macro-card';
import './cards/energy-flow-card';
import './cards/security-matrix-card';
import './cards/weather-radar-card';
import './cards/multi-room-audio-card';
import './cards/hvac-zoning-card';
import './cards/mesh-topology-card';
import './cards/ev-charger-card';
import './cards/air-quality-matrix-card';
import './cards/interactive-floorplan-card';

@customElement('aurora-card')
export class AuroraCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: AuroraCardConfig;

  public setConfig(config: AuroraCardConfig): void {
    if (!config) {
      throw new Error('Invalid Aurora Card configuration');
    }
    this._config = {
      card_type: 'button',
      ...config,
    };
  }

  public getCardSize(): number {
    if (this._config?.card_type === 'empty-column') return 0;
    if (
      [
        'media-player',
        'climate',
        'energy-flow',
        'security-matrix',
        'weather-radar',
        'multi-room-audio',
        'hvac-zoning',
        'mesh-topology',
        'floorplan',
      ].includes(this._config?.card_type || '')
    ) {
      return 3;
    }
    return 1;
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('aurora-card-editor');
  }

  public static getStubConfig(): Record<string, any> {
    return {
      type: 'custom:aurora-card',
      card_type: 'button',
      button_type: 'switch',
      entity: 'light.living_room',
      name: 'Living Room',
      icon: 'mdi:ceiling-light',
    };
  }

  protected updated(changedProps: Map<string, any>): void {
    super.updated(changedProps);
    if (this.hass) {
      registerAuroraTheme(this.hass);
    }
  }

  protected render() {
    if (!this._config || !this.hass) return html``;

    // Evaluate visibility condition engine
    if (!evaluateVisibility(this.hass, this._config.visibility)) {
      this.style.display = 'none';
      return html``;
    }
    this.style.display = 'block';

    // Dispatcher for all 17 Aurora Card architectures
    switch (this._config.card_type) {
      case 'pop-up':
        return html`<aurora-pop-up-card .hass="${this.hass}" .config="${this._config}"></aurora-pop-up-card>`;
      case 'separator':
        return html`<aurora-separator-card .hass="${this.hass}" .config="${this._config}"></aurora-separator-card>`;
      case 'cover':
        return html`<aurora-cover-card .hass="${this.hass}" .config="${this._config}"></aurora-cover-card>`;
      case 'climate':
        return html`<aurora-climate-card .hass="${this.hass}" .config="${this._config}"></aurora-climate-card>`;
      case 'media-player':
        return html`<aurora-media-card .hass="${this.hass}" .config="${this._config}"></aurora-media-card>`;
      case 'empty-column':
        return html`<aurora-empty-column-card .config="${this._config}"></aurora-empty-column-card>`;
      case 'routine-macro':
        return html`<aurora-routine-macro-card .hass="${this.hass}" .config="${this._config}"></aurora-routine-macro-card>`;
      case 'energy-flow':
        return html`<aurora-energy-flow-card .hass="${this.hass}" .config="${this._config}"></aurora-energy-flow-card>`;
      case 'security-matrix':
        return html`<aurora-security-matrix-card .hass="${this.hass}" .config="${this._config}"></aurora-security-matrix-card>`;
      case 'weather-radar':
        return html`<aurora-weather-radar-card .hass="${this.hass}" .config="${this._config}"></aurora-weather-radar-card>`;
      case 'multi-room-audio':
        return html`<aurora-multi-room-audio-card .hass="${this.hass}" .config="${this._config}"></aurora-multi-room-audio-card>`;
      case 'hvac-zoning':
        return html`<aurora-hvac-zoning-card .hass="${this.hass}" .config="${this._config}"></aurora-hvac-zoning-card>`;
      case 'mesh-topology':
        return html`<aurora-mesh-topology-card .hass="${this.hass}" .config="${this._config}"></aurora-mesh-topology-card>`;
      case 'ev-charger':
        return html`<aurora-ev-charger-card .hass="${this.hass}" .config="${this._config}"></aurora-ev-charger-card>`;
      case 'air-quality':
        return html`<aurora-air-quality-matrix-card .hass="${this.hass}" .config="${this._config}"></aurora-air-quality-matrix-card>`;
      case 'floorplan':
        return html`<aurora-interactive-floorplan-card .hass="${this.hass}" .config="${this._config}"></aurora-interactive-floorplan-card>`;
      case 'button':
      default:
        return html`<aurora-button-card .hass="${this.hass}" .config="${this._config}"></aurora-button-card>`;
    }
  }
}

declare global {
  interface Window {
    customCards: Array<Record<string, any>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'aurora-card',
  name: 'Aurora Card',
  description: 'High-performance modular glassmorphism card suite for Home Assistant.',
  preview: true,
});