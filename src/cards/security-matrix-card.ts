import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-security-matrix-card')
export class AuroraSecurityMatrixCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;
  @state() private _selectedCamIndex = 0;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const cameras =
      this.config.cameras && this.config.cameras.length > 0
        ? this.config.cameras
        : this.config.entity
        ? [this.config.entity]
        : [];

    const activeCamId = cameras[this._selectedCamIndex] || cameras[0];
    const camStateObj = activeCamId ? this.hass.states[activeCamId] : undefined;
    const camPicture = camStateObj?.attributes.entity_picture;

    const alarmEntity = this.config.alarm_entity;
    const alarmState = alarmEntity ? this.hass.states[alarmEntity]?.state : undefined;

    const chimeState = this.config.doorbell_chime_entity
      ? this.hass.states[this.config.doorbell_chime_entity]
      : undefined;
    const motionState = this.config.doorbell_motion_entity
      ? this.hass.states[this.config.doorbell_motion_entity]
      : undefined;

    return html`
      <ha-card>
        <div class="sec-header">
          <div class="sec-title-group">
            <ha-icon .icon="${this.config.icon || 'mdi:shield-home'}"></ha-icon>
            <div class="sec-titles">
              <span class="title">${this.config.name || 'Security & Perimeter Hub'}</span>
              <span class="subtitle">
                ${alarmState ? `Alarm: ${alarmState.replace('_', ' ')}` : 'Perimeter Active'}
              </span>
            </div>
          </div>

          ${cameras.length > 1
            ? html`
                <div class="cam-tabs">
                  ${cameras.map(
                    (camId, idx) => html`
                      <button
                        class="cam-tab ${idx === this._selectedCamIndex ? 'active' : ''}"
                        @click="${() => (this._selectedCamIndex = idx)}"
                      >
                        Cam ${idx + 1}
                      </button>
                    `
                  )}
                </div>
              `
            : ''}
        </div>

        <!-- Camera / Doorbell Viewport -->
        <div
          class="camera-viewport"
          @click="${() =>
            activeCamId &&
            handleAction(this, this.hass, { entity: activeCamId, tap_action: { action: 'more-info' } }, 'tap')}"
        >
          ${camPicture
            ? html`<img src="${camPicture}" alt="${activeCamId}" />`
            : html`
                <div class="cam-fallback">
                  <ha-icon icon="mdi:cctv"></ha-icon>
                  <span>${camStateObj?.attributes.friendly_name || activeCamId || 'Camera Stream Ready'}</span>
                </div>
              `}
          <div class="live-pill">
            <span class="dot"></span>
            LIVE
          </div>
        </div>

        <!-- Doorbell / Perimeter Status Pills (Chime, Entryway Doorbell, Motion) -->
        <div class="telemetry-pills">
          ${activeCamId
            ? html`
                <div
                  class="t-pill"
                  @click="${() =>
                    handleAction(this, this.hass, { entity: activeCamId, tap_action: { action: 'more-info' } }, 'tap')}"
                >
                  <ha-icon icon="mdi:doorbell-video"></ha-icon>
                  <span>${camStateObj?.attributes.friendly_name || 'Entryway Doorbell'}: ${camStateObj?.state || 'Ready'}</span>
                </div>
              `
            : ''}
          ${chimeState
            ? html`
                <div
                  class="t-pill"
                  @click="${() =>
                    handleAction(this, this.hass, { entity: chimeState.entity_id, tap_action: { action: 'toggle' } }, 'tap')}"
                >
                  <ha-icon icon="mdi:bell-ring-outline"></ha-icon>
                  <span>Chime: ${chimeState.state}</span>
                </div>
              `
            : ''}
          ${motionState
            ? html`
                <div class="t-pill ${motionState.state === 'on' ? 'alert' : ''}">
                  <ha-icon icon="mdi:motion-sensor"></ha-icon>
                  <span>Motion: ${motionState.state}</span>
                </div>
              `
            : ''}
        </div>

        ${alarmEntity
          ? html`
              <div class="alarm-actions">
                <button @click="${() => this._setAlarm('alarm_arm_home')}">Arm Home</button>
                <button @click="${() => this._setAlarm('alarm_arm_away')}">Arm Away</button>
                <button class="disarm" @click="${() => this._setAlarm('alarm_disarm')}">Disarm</button>
              </div>
            `
          : ''}
      </ha-card>
    `;
  }

  private _setAlarm(service: string) {
    if (!this.config.alarm_entity) return;
    this.hass.callService('alarm_control_panel', service, {
      entity_id: this.config.alarm_entity,
    });
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
      .sec-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sec-title-group {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-accent-color);
      }
      .sec-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .cam-tabs {
        display: flex;
        gap: 6px;
      }
      .cam-tab {
        padding: 4px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-secondary);
        font-size: 11px;
        cursor: pointer;
      }
      .cam-tab.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
        border-color: var(--aurora-accent-color);
      }
      .camera-viewport {
        position: relative;
        height: 165px;
        border-radius: 14px;
        overflow: hidden;
        background: rgba(10, 14, 24, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .camera-viewport img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cam-fallback {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        color: var(--aurora-text-secondary);
        font-size: 12px;
      }
      .live-pill {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 9px;
        border-radius: 10px;
        background: rgba(239, 68, 68, 0.85);
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
      }
      .telemetry-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .t-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 12px;
        cursor: pointer;
      }
      .t-pill.alert {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        color: #fca5a5;
      }
      .alarm-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .alarm-actions button {
        padding: 8px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .alarm-actions button:hover {
        background: var(--aurora-accent-color);
      }
    `,
  ];
}