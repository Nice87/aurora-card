import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, AuroraFloorplanHotspot, fireEvent, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-interactive-floorplan-card')
export class AuroraInteractiveFloorplanCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const hotspots: AuroraFloorplanHotspot[] =
      this.config.hotspots && this.config.hotspots.length > 0
        ? this.config.hotspots
        : this.config.entity
        ? [{ entity: this.config.entity, x: 50, y: 50, icon: this.config.icon || 'mdi:lightbulb' }]
        : [];

    return html`
      <ha-card>
        <div class="fp-header">
          <ha-icon .icon="${this.config.icon || 'mdi:floor-plan'}"></ha-icon>
          <span class="title">${this.config.name || 'Interactive Zone Floorplan'}</span>
        </div>

        <div
          class="fp-canvas"
          style="${this.config.image_url ? `background-image: url('${this.config.image_url}')` : ''}"
        >
          ${!this.config.image_url
            ? html`
                <div class="fp-grid-lines">
                  <div class="room-box">Living Room</div>
                  <div class="room-box">Kitchen</div>
                  <div class="room-box">Hall</div>
                  <div class="room-box">Bedroom</div>
                </div>
              `
            : ''}

          ${hotspots.map((spot) => {
            if (!spot.entity) return;
            const stateObj = this.hass.states[spot.entity];
            const isActive = stateObj && ['on', 'open', 'playing', 'detected'].includes(stateObj.state);
            const icon = spot.icon || stateObj?.attributes.icon || 'mdi:radiobox-marked';

            return html`
              <button
                class="hotspot-pin ${isActive ? 'active' : ''}"
                style="left: ${spot.x}%; top: ${spot.y}%"
                @click="${() => this._onHotspotClick(spot)}"
                title="${spot.name || stateObj?.attributes.friendly_name || spot.entity}"
              >
                <ha-icon .icon="${icon}"></ha-icon>
              </button>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  private _onHotspotClick(spot: AuroraFloorplanHotspot) {
    if (spot.hash) {
      window.location.hash = spot.hash.startsWith('#') ? spot.hash : `#${spot.hash}`;
      fireEvent(window, 'location-changed', {});
      return;
    }
    handleAction(this, this.hass, { entity: spot.entity, tap_action: { action: 'toggle' } }, 'tap');
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
        gap: 12px;
      }
      .fp-header {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-accent-color);
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .fp-canvas {
        position: relative;
        height: 190px;
        border-radius: 14px;
        background-color: rgba(10, 15, 28, 0.75);
        background-size: cover;
        background-position: center;
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .fp-grid-lines {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        width: 100%;
        height: 100%;
      }
      .room-box {
        border: 1px dashed rgba(255, 255, 255, 0.08);
        padding: 10px;
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .hotspot-pin {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(15, 23, 42, 0.85);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .hotspot-pin.active {
        background: var(--aurora-accent-color);
        border-color: #ffffff;
        color: #ffffff;
        box-shadow: 0 0 18px var(--aurora-accent-glow);
      }
    `,
  ];
}