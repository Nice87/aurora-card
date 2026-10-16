import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-ev-charger-card')
export class AuroraEvChargerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const socObj = this.config.entity ? this.hass.states[this.config.entity] : undefined;
    const soc = Math.min(100, Math.max(0, Number(socObj?.state || 0)));

    const powerVal = this.config.power_entity
      ? this.hass.states[this.config.power_entity]?.state || '0'
      : '0';

    const switchEntity = this.config.charger_switch_entity || this.config.entity;
    const isCharging =
      (switchEntity && this.hass.states[switchEntity]?.state === 'on') || Number(powerVal) > 10;

    return html`
      <ha-card class="${isCharging ? 'charging' : ''}">
        <div class="ev-top">
          <div
            class="ev-id"
            @click="${() =>
              handleAction(this, this.hass, { entity: this.config.entity, tap_action: { action: 'more-info' } }, 'tap')}"
          >
            <div class="ev-icon">
              <ha-icon .icon="${this.config.icon || 'mdi:ev-station'}"></ha-icon>
            </div>
            <div class="ev-titles">
              <span class="title">${this.config.name || socObj?.attributes.friendly_name || 'Smart Charger Hub'}</span>
              <span class="subtitle">${isCharging ? `Charging • ${powerVal} W` : 'Standby'}</span>
            </div>
          </div>

          <button class="charge-btn ${isCharging ? 'active' : ''}" @click="${this._toggleCharge}">
            ${isCharging ? 'STOP' : 'CHARGE'}
          </button>
        </div>

        <div class="soc-bar-container">
          <div class="soc-bar-fill" style="width: ${soc}%"></div>
          <span class="soc-label">Battery SoC: ${isNaN(soc) ? '--' : `${soc}%`}</span>
        </div>
      </ha-card>
    `;
  }

  private _toggleCharge() {
    const target = this.config.charger_switch_entity || this.config.entity;
    if (!target) return;
    this.hass.callService('homeassistant', 'toggle', { entity_id: target });
  }

  static styles = [
    LuminaThemeStyles,
    css`
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
      }
      ha-card.charging {
        border-color: var(--aurora-success-color);
      }
      .ev-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ev-id {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .ev-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(52, 211, 153, 0.16);
        color: var(--aurora-success-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ev-titles {
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
      .charge-btn {
        padding: 6px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: var(--aurora-surface-subtle);
        color: var(--aurora-text-primary);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .charge-btn.active {
        background: var(--aurora-success-color);
        border-color: var(--aurora-success-color);
        color: #064e3b;
      }
      .soc-bar-container {
        position: relative;
        height: 26px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .soc-bar-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(52, 211, 153, 0.35), rgba(52, 211, 153, 0.75));
        transition: width 0.3s ease;
      }
      .soc-label {
        position: relative;
        z-index: 1;
        font-size: 12px;
        font-weight: 700;
      }
    `,
  ];
}