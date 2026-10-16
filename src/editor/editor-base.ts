import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { AuroraCardConfig, AuroraSubButtonConfig, fireEvent } from '../utils/hass-connect';

@customElement('aurora-card-editor')
export class AuroraCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: AuroraCardConfig;
  @state() private _activeTab: string = 'general';
  @state() private _entitySearchFilter: string = '';

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
    const tapAction = this._config.tap_action?.action || 'toggle';
    const subButtons = this._config.sub_button || [];

    const allEntities = Object.keys(this.hass.states).sort();
    const filteredEntities = allEntities.filter((ent) => {
      const friendly = (this.hass.states[ent]?.attributes.friendly_name || '').toLowerCase();
      const query = this._entitySearchFilter.toLowerCase();
      return ent.toLowerCase().includes(query) || friendly.includes(query);
    });

    return html`
      <div class="card-config-container">
        <div class="editor-header">
          <div class="header-titles">
            <h3>Aurora Card Studio</h3>
            <p>Modular glassmorphism card suite & module store</p>
          </div>
          <div class="editor-tabs">
            <button
              class="tab-btn ${this._activeTab === 'general' ? 'active' : ''}"
              @click="${() => (this._activeTab = 'general')}"
            >
              General
            </button>
            <button
              class="tab-btn ${this._activeTab === 'subbuttons' ? 'active' : ''}"
              @click="${() => (this._activeTab = 'subbuttons')}"
            >
              Sub-Buttons (${subButtons.length})
            </button>
            <button
              class="tab-btn ${this._activeTab === 'styles' ? 'active' : ''}"
              @click="${() => (this._activeTab = 'styles')}"
            >
              Styles
            </button>
            <button
              class="tab-btn ${this._activeTab === 'modules' ? 'active' : ''}"
              @click="${() => (this._activeTab = 'modules')}"
            >
              Module Store 📦
            </button>
          </div>
        </div>

        ${this._activeTab === 'general'
          ? html`
              <div class="tab-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Card Architecture</label>
                    <select
                      .value="${cardType}"
                      @change="${(e: Event) => this._valueChanged(e, 'card_type')}"
                    >
                      <option value="button">Button / Slider</option>
                      <option value="pop-up">Pop-up Container</option>
                      <option value="separator">Separator / Header</option>
                      <option value="cover">Cover / Shutter</option>
                      <option value="climate">Climate / HVAC</option>
                      <option value="media-player">Media Player</option>
                      <option value="energy-flow">Energy Flow Matrix</option>
                      <option value="security-matrix">Security & Camera Hub</option>
                      <option value="hvac-zoning">HVAC & Storage Heating</option>
                      <option value="mesh-topology">Zigbee / Matter Mesh</option>
                      <option value="floorplan">Interactive Floorplan</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Primary Entity Search</label>
                    <input
                      type="text"
                      placeholder="Filter entities..."
                      .value="${this._entitySearchFilter}"
                      @input="${(e: Event) =>
                        (this._entitySearchFilter = (e.target as HTMLInputElement).value)}"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Primary Entity</label>
                  <select
                    .value="${entity}"
                    @change="${(e: Event) => this._valueChanged(e, 'entity')}"
                  >
                    <option value="">-- Select Entity --</option>
                    ${filteredEntities.map(
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
                    <label>Custom Title</label>
                    <input
                      type="text"
                      .value="${name}"
                      placeholder="Auto"
                      @input="${(e: Event) => this._valueChanged(e, 'name')}"
                    />
                  </div>
                  <div class="form-group">
                    <label>Custom Icon</label>
                    <input
                      type="text"
                      .value="${icon}"
                      placeholder="mdi:lightbulb"
                      @input="${(e: Event) => this._valueChanged(e, 'icon')}"
                    />
                  </div>
                </div>
              </div>
            `
          : ''}

        ${this._activeTab === 'subbuttons'
          ? html`
              <div class="tab-content">
                <div class="sub-header-row">
                  <span>Sub-Button Stack (${subButtons.length})</span>
                  <button class="primary-action-btn" @click="${this._addSubButton}">+ Add</button>
                </div>
                <div class="sub-list">
                  ${subButtons.map(
                    (sub, idx) => html`
                      <div class="sub-item-card">
                        <select
                          .value="${sub.entity || ''}"
                          @change="${(e: Event) =>
                            this._updateSubButton(idx, 'entity', (e.target as HTMLSelectElement).value)}"
                        >
                          <option value="">-- Entity --</option>
                          ${allEntities.map(
                            (ent) => html`<option value="${ent}" ?selected="${ent === sub.entity}">${ent}</option>`
                          )}
                        </select>
                        <input
                          type="text"
                          placeholder="Icon"
                          .value="${sub.icon || ''}"
                          @input="${(e: Event) =>
                            this._updateSubButton(idx, 'icon', (e.target as HTMLInputElement).value)}"
                        />
                        <button class="danger-btn" @click="${() => this._removeSubButton(idx)}">✕</button>
                      </div>
                    `
                  )}
                </div>
              </div>
            `
          : ''}

        ${this._activeTab === 'styles'
          ? html`
              <div class="tab-content">
                <div class="form-group">
                  <label>Backdrop Blur & Card Mod</label>
                  <input
                    type="text"
                    placeholder="blur(20px) saturate(180%)"
                    @input="${(e: Event) => this._valueChanged(e, 'backdrop_blur')}"
                  />
                </div>
              </div>
            `
          : ''}

        ${this._activeTab === 'modules'
          ? html`
              <div class="tab-content">
                <div class="module-store-header">
                  <h4>Aurora Module Store 📦</h4>
                  <p>Discover and install community modules & macro packs.</p>
                </div>
                <div class="module-grid">
                  <div class="module-card-item">
                    <div class="m-info">
                      <span class="m-title">Advanced Energy Flow Pack</span>
                      <span class="m-desc">Animated battery and solar particle streams.</span>
                    </div>
                    <button class="install-btn" @click="${() => alert('Installed!')}">Install</button>
                  </div>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _valueChanged(e: Event, field: string) {
    if (!this._config) return;
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    this._config = { ...this._config, [field]: target.value || undefined };
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
    updated[index] = { ...updated[index], [key]: val || undefined };
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
      padding: 4px 0;
    }
    .card-config-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .editor-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 12px;
    }
    .header-titles h3 {
      margin: 0 0 2px 0;
      font-size: 17px;
    }
    .header-titles p {
      margin: 0;
      font-size: 12px;
      color: #94a3b8;
    }
    .editor-tabs {
      display: flex;
      gap: 6px;
    }
    .tab-btn {
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .tab-btn.active {
      background: #818cf8;
      color: #fff;
      border-color: #818cf8;
    }
    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
    }
    select, input {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      padding: 9px 12px;
      font-size: 13px;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    select:focus, input:focus {
      border-color: #818cf8;
    }
    .sub-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
    }
    .primary-action-btn {
      background: #818cf8;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
    }
    .sub-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sub-item-card {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px;
      border-radius: 10px;
    }
    .danger-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 6px;
      width: 32px;
      height: 34px;
      cursor: pointer;
    }
    .module-store-header h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
    }
    .module-store-header p {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: #94a3b8;
    }
    .module-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .module-card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px;
      border-radius: 12px;
    }
    .m-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .m-title {
      font-size: 13px;
      font-weight: 600;
    }
    .m-desc {
      font-size: 11px;
      color: #94a3b8;
    }
    .install-btn {
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.4);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
    }
  `;
}