var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';
let AuroraAirQualityMatrixCard = class AuroraAirQualityMatrixCard extends LitElement {
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const co2 = this._getState(this.config.co2_entity || this.config.entity, '420');
        const pm25 = this._getState(this.config.pm25_entity, '6');
        const humidity = this._getState(this.config.humidity_entity, '48');
        const airDensity = this._getState(this.config.air_density_entity, '1.204');
        const co2Num = parseFloat(co2);
        const statusLabel = co2Num > 1000 ? 'Ventilate Soon' : 'Optimal Air Quality';
        return html `
      <ha-card
        @click="${() => handleAction(this, this.hass, { entity: this.config.entity, tap_action: { action: 'more-info' } }, 'tap')}"
      >
        <div class="aq-header">
          <div class="aq-left">
            <div class="aq-icon">
              <ha-icon .icon="${this.config.icon || 'mdi:air-filter'}"></ha-icon>
            </div>
            <div class="aq-titles">
              <span class="title">${this.config.name || 'Air Quality & Density Matrix'}</span>
              <span class="subtitle">${statusLabel}</span>
            </div>
          </div>
        </div>

        <div class="aq-metrics">
          <div class="aq-box">
            <span class="lbl">CO₂</span>
            <span class="val">${co2} ppm</span>
          </div>
          <div class="aq-box">
            <span class="lbl">PM2.5</span>
            <span class="val">${pm25} µg/m³</span>
          </div>
          <div class="aq-box">
            <span class="lbl">Humidity</span>
            <span class="val">${humidity}%</span>
          </div>
          <div class="aq-box">
            <span class="lbl">Air Density</span>
            <span class="val">${airDensity} kg/m³</span>
          </div>
        </div>
      </ha-card>
    `;
    }
    _getState(entityId, fallback = '--') {
        if (!entityId || !this.hass.states[entityId])
            return fallback;
        return this.hass.states[entityId].state;
    }
    static { this.styles = [
        LuminaThemeStyles,
        css `
      ha-card {
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
        cursor: pointer;
      }
      .aq-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .aq-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .aq-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .aq-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .aq-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .aq-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 6px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .lbl {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .val {
        font-size: 12px;
        font-weight: 700;
        margin-top: 2px;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraAirQualityMatrixCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraAirQualityMatrixCard.prototype, "config", void 0);
AuroraAirQualityMatrixCard = __decorate([
    customElement('aurora-air-quality-matrix-card')
], AuroraAirQualityMatrixCard);
export { AuroraAirQualityMatrixCard };
