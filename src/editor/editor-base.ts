import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { AuroraCardConfig, AuroraSubButtonConfig, fireEvent } from '../utils/hass-connect';

@customElement('aurora-card-editor')
export class AuroraCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: AuroraCardConfig;

  public setConfig(config: AuroraCardConfig): void {
    this._config = {
      card_type: 'button',
      button_type: 'switch',
      ...config,
    };
  }

  protected render() {
    if (!this._config || !this.hass) return html``;

    const cardType = this._config.card_type || 'button';
    const buttonType = this._config.button_type || 'switch';
    const entity = this._config.entity || '';
    const name = this._config.name || '';
    const icon = this._config.icon || '';
    const hash = this._config.hash || '#aurora-popup';
    const tapAction = this._config.tap_action?.action || 'toggle';
    const subButtons = this._config.sub_button || [];

    const entities = Object.keys(this.hass.states).sort();

    return html`
      <div class="card-config-container">
        <div class="section-header">
          <h3>Aurora Card Studio</h3>
          <p>Configure card architecture, entities, interactive sliders, pop-ups, and sub-buttons.</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="card_type">Card Type</label>
            <select
              id="card_type"
              .value="${cardType}"
              @change="${(e: Event) => this._valueChanged(e, 'card_type')}"
            >
              <optgroup label="Core Bubble Parity">
                <option value="button" ?selected="${cardType === 'button'}">Button / Slider</option>
                <option value="pop-up" ?selected="${cardType === 'pop-up'}">Pop-up Container</option>
                <option value="separator" ?selected="${cardType === 'separator'}">Separator / Header</option>
                <option value="cover" ?selected="${cardType === 'cover'}">Cover / Shutter</option>
                <option value="climate" ?selected="${cardType === 'climate'}">Climate / HVAC</option>
                <option value="media-player" ?selected="${cardType === 'media-player'}">Media Player</option>
                <option value="empty-column" ?selected="${cardType === 'empty-column'}">Empty Column Spacer</option>
              </optgroup>
              <optgroup label="Aurora Advanced Cards">
                <option value="routine-macro" ?selected="${cardType === 'routine-macro'}">Routine Macro Launcher</option>
                <option value="energy-flow" ?selected="${cardType === 'energy-flow'}">Energy Flow Matrix</option>
                <option value="security-matrix" ?selected="${cardType === 'security-matrix'}">Security & Camera Hub</option>
                <option value="weather-radar" ?selected="${cardType === 'weather-radar'}">Weather & Microclimate</option>
                <option value="multi-room-audio" ?selected="${cardType === 'multi-room-audio'}">Multi-Room Audio (MA)</option>
                <option value="hvac-zoning" ?selected="${cardType === 'hvac-zoning'}">HVAC & Storage Heating</option>
                <option value="mesh-topology" ?selected="${cardType === 'mesh-topology'}">Zigbee / Matter Mesh</option>
                <option value="ev-charger" ?selected="${cardType === 'ev-charger'}">EV & Solar Charger</option>
                <option value="air-quality" ?selected="${cardType === 'air-quality'}">Air Quality Matrix</option>
                <option value="floorplan" ?selected="${cardType === 'floorplan'}">Interactive Floorplan</option>
              </optgroup>
            </select>
          </div>

          ${cardType === 'button'
            ? html`
                <div class="form-group">
                  <label for="button_type">Button Behavior</label>
                  <select
                    id="button_type"
                    .value="${buttonType}"
                    @change="${(e: Event) => this._valueChanged(e, 'button_type')}"
                  >
                    <option value="switch" ?selected="${buttonType === 'switch'}">Switch (Toggle)</option>
                    <option value="slider" ?selected="${buttonType === 'slider'}">Range Slider</option>
                    <option value="state" ?selected="${buttonType === 'state'}">State Display (More Info)</option>
                    <option value="name" ?selected="${buttonType === 'name'}">Name / Text Only</option>
                  </select>
                </div>
              `
            : ''}

          ${cardType === 'pop-up'
            ? html`
                <div class="form-group">
                  <label for="hash">Pop-up URL Hash Trigger</label>
                  <input
                    id="hash"
                    type="text"
                    .value="${hash}"
                    placeholder="#living-room"
                    @input="${(e: Event) => this._valueChanged(e, 'hash')}"
                  />
                </div>
              `
            : ''}
        </div>

        ${cardType !== 'empty-column'
          ? html`
              <div class="form-group">
                <label for="entity">Primary Entity</label>
                <select
                  id="entity"
                  .value="${entity}"
                  @change="${(e: Event) => this._valueChanged(e, 'entity')}"
                >
                  <option value="">-- Select Entity --</option>
                  ${entities.map(
                    (ent) => html`
                      <option value="${ent}" ?selected="${ent === entity}">
                        ${this.hass.states[ent]?.attributes.friendly_name || ent} (${ent})
                      </option>
                    `
                  )}
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="name">Custom Title</label>
                  <input
                    id="name"
                    type="text"
                    .value="${name}"
                    placeholder="Auto from entity"
                    @input="${(e: Event) => this._valueChanged(e, 'name')}"
                  />
                </div>
                <div class="form-group">
                  <label for="icon">Custom Icon</label>
                  <input
                    id="icon"
                    type="text"
                    .value="${icon}"
                    placeholder="e.g. mdi:lightbulb"
                    @input="${(e: Event) => this._valueChanged(e, 'icon')}"
                  />
                </div>
              </div>

              ${cardType === 'hvac-zoning'
                ? html`
                    <div class="form-group">
                      <label>Single Charging Window</label>
                      <input
                        type="text"
                        .value="${this._config.charging_window || '00:30 – 04:30'}"
                        @input="${(e: Event) => this._valueChanged(e, 'charging_window')}"
                      />
                    </div>
                  `
                : ''}

              ${cardType === 'floorplan'
                ? html`
                    <div class="form-group">
                      <label>Floorplan Background Image URL (Optional)</label>
                      <input
                        type="text"
                        .value="${this._config.image_url || ''}"
                        placeholder="/local/floorplan.png"
                        @input="${(e: Event) => this._valueChanged(e, 'image_url')}"
                      />
                    </div>
                  `
                : ''}

              <div class="form-group">
                <label for="tap_action">Tap Action</label>
                <select
                  id="tap_action"
                  .value="${tapAction}"
                  @change="${(e: Event) => this._actionChanged(e)}"
                >
                  <option value="toggle" ?selected="${tapAction === 'toggle'}">Toggle Entity</option>
                  <option value="more-info" ?selected="${tapAction === 'more-info'}">More Info Dialog</option>
                  <option value="navigate" ?selected="${tapAction === 'navigate'}">Navigate / Open Pop-up (#hash)</option>
                  <option value="call-service" ?selected="${tapAction === 'call-service'}">Call Service</option>
                  <option value="none" ?selected="${tapAction === 'none'}">None</option>
                </select>
              </div>

              <div class="sub-buttons-section">
                <div class="sub-header">
                  <span>Sub-Buttons (${subButtons.length})</span>
                  <button class="add-btn" @click="${this._addSubButton}">+ Add Sub-Button</button>
                </div>
                ${subButtons.map(
                  (sub, idx) => html`
                    <div class="sub-item">
                      <select
                        .value="${sub.entity || ''}"
                        @change="${(e: Event) =>
                          this._updateSubButton(idx, 'entity', (e.target as HTMLSelectElement).value)}"
                      >
                        <option value="">-- Sub Entity --</option>
                        ${entities.map(
                          (ent) => html`
                            <option value="${ent}" ?selected="${ent === sub.entity}">${ent}</option>
                          `
                        )}
                      </select>
                      <input
                        type="text"
                        placeholder="mdi:icon"
                        .value="${sub.icon || ''}"
                        @input="${(e: Event) =>
                          this._updateSubButton(idx, 'icon', (e.target as HTMLInputElement).value)}"
                      />
                      <button class="remove-btn" @click="${() => this._removeSubButton(idx)}">✕</button>
                    </div>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _valueChanged(e: Event, field: string) {
    if (!this._config) return;
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;

    this._config = {
      ...this._config,
      [field]: value === '' ? undefined : value,
    };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _actionChanged(e: Event) {
    if (!this._config) return;
    const target = e.target as HTMLSelectElement;
    this._config = {
      ...this._config,
      tap_action: {
        ...(this._config.tap_action || {}),
        action: target.value as any,
      },
    };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _addSubButton() {
    if (!this._config) return;
    const current = [...(this._config.sub_button || [])];
    current.push({ icon: 'mdi:power', show_state: true });
    this._config = { ...this._config, sub_button: current };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _updateSubButton(index: number, key: keyof AuroraSubButtonConfig, val: any) {
    if (!this._config || !this._config.sub_button) return;
    const updated = [...this._config.sub_button];
    updated[index] = { ...updated[index], [key]: val === '' ? undefined : val };
    this._config = { ...this._config, sub_button: updated };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _removeSubButton(index: number) {
    if (!this._config || !this._config.sub_button) return;
    const updated = this._config.sub_button.filter((_, i) => i !== index);
    this._config = { ...this._config, sub_button: updated };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #f8fafc);
      font-family: var(--paper-font-body1_-_font-family, inherit);
      padding: 8px 0;
    }
    .card-config-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .section-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 10px;
    }
    .section-header h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }
    .section-header p {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color, #94a3b8);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
    }
    select,
    input {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 8px;
      color: #ffffff;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    select:focus,
    input:focus {
      border-color: #818cf8;
      box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.25);
    }
    .sub-buttons-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sub-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
    }
    .add-btn {
      background: #818cf8;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .sub-item {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
    }
    .remove-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 6px;
      width: 34px;
      height: 36px;
      cursor: pointer;
    }
  `;
}