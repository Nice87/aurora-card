import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-hvac-zoning-card')
export class AuroraHvacZoningCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const zones =
      this.config.zone_entities && this.config.zone_entities.length > 0
        ? this.config.zone_entities
        : this.config.entity
        ? [this.config.entity]
        : Object.keys(this.hass.states)
            .filter((id) => id.startsWith('climate.'))
            .slice(0, 4);

    const chargingWindow = this.config.charging_window || '00:30 – 04:30';
    const isOffPeakActive = this._checkOffPeakWindow(chargingWindow);

    return html`
      <ha-card>
        <div class="zoning-header">
          <div class="header-left">
            <div class="hvac-badge-icon">
              <ha-icon .icon="${this.config.icon || 'mdi:radiator'}"></ha-icon>
            </div>
            <div class="header-titles">
              <span class="title">${this.config.name || 'HVAC & Storage Zoning'}</span>
              <span class="subtitle">${zones.length} Active Thermal Zones</span>
            </div>
          </div>

          <div class="window-pill ${isOffPeakActive ? 'charging' : ''}">
            <ha-icon icon="mdi:clock-bolt-outline"></ha-icon>
            <span>${chargingWindow}</span>
          </div>
        </div>

        <div class="zones-grid">
          ${zones.map((zoneId) => {
            const stateObj = this.hass.states[zoneId];
            if (!stateObj) return html``;
            const friendly = stateObj.attributes.friendly_name || zoneId;
            const currentT = stateObj.attributes.current_temperature ?? '--';
            const targetT = stateObj.attributes.temperature ?? 20;
            const mode = stateObj.state;
            const isHeating =
              stateObj.attributes.hvac_action === 'heating' || mode === 'heat' || mode === 'boost';

            return html`
              <div class="zone-card ${isHeating ? 'heating' : ''}">
                <div
                  class="zone-info"
                  @click="${() =>
                    handleAction(this, this.hass, { entity: zoneId, tap_action: { action: 'more-info' } }, 'tap')}"
                >
                  <span class="z-name">${friendly}</span>
                  <span class="z-status">${mode} • Now ${currentT}°C</span>
                </div>

                <div class="zone-controls">
                  <button class="z-step" @click="${() => this._stepZoneTemp(zoneId, Number(targetT) - 0.5)}">
                    <ha-icon icon="mdi:minus"></ha-icon>
                  </button>
                  <span class="z-target">${targetT}°</span>
                  <button class="z-step" @click="${() => this._stepZoneTemp(zoneId, Number(targetT) + 0.5)}">
                    <ha-icon icon="mdi:plus"></ha-icon>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  private _stepZoneTemp(entityId: string, newTemp: number) {
    this.hass.callService('climate', 'set_temperature', {
      entity_id: entityId,
      temperature: newTemp,
    });
  }

  private _checkOffPeakWindow(windowStr: string): boolean {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (windowStr.includes('00:30') && windowStr.includes('04:30')) {
      return minutes >= 30 && minutes <= 270;
    }
    return false;
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
      .zoning-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .hvac-badge-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .header-titles {
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
      .window-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 11px;
        font-weight: 600;
        color: var(--aurora-text-secondary);
      }
      .window-pill.charging {
        background: rgba(52, 211, 153, 0.16);
        border-color: rgba(52, 211, 153, 0.4);
        color: var(--aurora-success-color);
      }
      .zones-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .zone-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 14px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;
      }
      .zone-card.heating {
        border-color: rgba(251, 146, 60, 0.4);
        background: rgba(251, 146, 60, 0.08);
      }
      .zone-info {
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }
      .z-name {
        font-size: 13px;
        font-weight: 600;
      }
      .z-status {
        font-size: 11px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .zone-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .z-step {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .z-step:hover {
        background: var(--aurora-accent-color);
      }
      .z-target {
        font-size: 14px;
        font-weight: 700;
        min-width: 34px;
        text-align: center;
      }
    `,
  ];
}