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
let AuroraClimateCard = class AuroraClimateCard extends LitElement {
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const entityId = this.config.entity;
        const stateObj = entityId ? this.hass.states[entityId] : undefined;
        const hvacMode = stateObj ? stateObj.state : 'off';
        const hvacAction = stateObj?.attributes.hvac_action || hvacMode;
        const currentTemp = stateObj?.attributes.current_temperature ?? '--';
        const targetTemp = stateObj?.attributes.temperature ?? 20;
        const step = this.config.step || stateObj?.attributes.target_temp_step || 0.5;
        const hvacModes = stateObj?.attributes.hvac_modes || ['off', 'heat', 'auto'];
        const name = this.config.name || stateObj?.attributes.friendly_name || 'Climate';
        const icon = this.config.icon || stateObj?.attributes.icon || 'mdi:thermostat';
        return html `
      <ha-card class="mode-${hvacMode}">
        <div class="climate-header">
          <div
            class="climate-id"
            @click="${() => handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap')}"
          >
            <div class="climate-icon ${hvacAction}">
              <ha-icon .icon="${icon}"></ha-icon>
            </div>
            <div class="climate-titles">
              <span class="title">${name}</span>
              <span class="subtitle">${hvacAction} • Current: ${currentTemp}°</span>
            </div>
          </div>

          <div class="temp-stepper">
            <button class="step-btn" @click="${() => this._adjustTemp(Number(targetTemp) - step)}">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <span class="target-val">${targetTemp}°</span>
            <button class="step-btn" @click="${() => this._adjustTemp(Number(targetTemp) + step)}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>

        <div class="hvac-modes-bar">
          ${hvacModes.map((mode) => html `
              <button
                class="mode-pill ${mode === hvacMode ? 'active' : ''}"
                @click="${() => this._setHvacMode(mode)}"
              >
                ${mode}
              </button>
            `)}
        </div>
      </ha-card>
    `;
    }
    _adjustTemp(newTemp) {
        if (!this.config.entity)
            return;
        this.hass.callService('climate', 'set_temperature', {
            entity_id: this.config.entity,
            temperature: newTemp,
        });
    }
    _setHvacMode(mode) {
        if (!this.config.entity)
            return;
        this.hass.callService('climate', 'set_hvac_mode', {
            entity_id: this.config.entity,
            hvac_mode: mode,
        });
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
        padding: 14px 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      ha-card.mode-heat {
        border-color: rgba(249, 115, 22, 0.45);
      }
      ha-card.mode-cool {
        border-color: rgba(56, 189, 248, 0.45);
      }
      .climate-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .climate-id {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .climate-icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .climate-icon.heating,
      .climate-icon.heat {
        background: rgba(249, 115, 22, 0.2);
        color: #fb923c;
      }
      .climate-icon.cooling,
      .climate-icon.cool {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
      }
      .climate-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .temp-stepper {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 8px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .step-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .step-btn:hover {
        background: var(--aurora-accent-color);
      }
      .target-val {
        font-size: 15px;
        font-weight: 700;
        min-width: 38px;
        text-align: center;
      }
      .hvac-modes-bar {
        display: flex;
        gap: 6px;
      }
      .mode-pill {
        flex: 1;
        padding: 6px 0;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: var(--aurora-text-secondary);
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .mode-pill.active {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
        color: #ffffff;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraClimateCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraClimateCard.prototype, "config", void 0);
AuroraClimateCard = __decorate([
    customElement('aurora-climate-card')
], AuroraClimateCard);
export { AuroraClimateCard };
