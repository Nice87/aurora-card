var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';
let AuroraCoverCard = class AuroraCoverCard extends LitElement {
    constructor() {
        super(...arguments);
        this._dragPos = null;
    }
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const entityId = this.config.entity;
        const stateObj = entityId ? this.hass.states[entityId] : undefined;
        const stateStr = stateObj ? stateObj.state : 'unavailable';
        const currentPos = stateObj?.attributes.current_position ?? (stateStr === 'open' ? 100 : 0);
        const displayPos = this._dragPos !== null ? this._dragPos : currentPos;
        const name = this.config.name || stateObj?.attributes.friendly_name || 'Cover';
        const icon = this.config.icon ||
            stateObj?.attributes.icon ||
            (displayPos > 0 ? 'mdi:window-shutter-open' : 'mdi:window-shutter');
        return html `
      <ha-card>
        <div class="cover-top">
          <div class="cover-identity" @click="${() => handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap')}">
            <div class="cover-icon ${displayPos > 0 ? 'open' : ''}">
              <ha-icon .icon="${icon}"></ha-icon>
            </div>
            <div class="cover-meta">
              <span class="title">${name}</span>
              <span class="subtitle">${stateStr} •${Math.round(displayPos)}%</span>
            </div>
          </div>

          <div class="cover-actions">
            <button class="ctrl-btn" @click="${() => this._callCover('open_cover')}" title="Open">
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button class="ctrl-btn" @click="${() => this._callCover('stop_cover')}" title="Stop">
              <ha-icon icon="mdi:stop"></ha-icon>
            </button>
            <button class="ctrl-btn" @click="${() => this._callCover('close_cover')}" title="Close">
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
          </div>
        </div>

        <div class="position-rail">
          <div class="position-fill" style="width: ${displayPos}%"></div>
          <input
            type="range"
            min="0"
            max="100"
            .value="${String(displayPos)}"
            @input="${(e) => {
            this._dragPos = Number(e.target.value);
        }}"
            @change="${(e) => {
            const pos = Number(e.target.value);
            this._dragPos = null;
            if (entityId) {
                this.hass.callService('cover', 'set_cover_position', {
                    entity_id: entityId,
                    position: pos,
                });
            }
        }}"
          />
        </div>
      </ha-card>
    `;
    }
    _callCover(service) {
        if (!this.config.entity)
            return;
        this.hass.callService('cover', service, { entity_id: this.config.entity });
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
      .cover-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .cover-identity {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        min-width: 0;
      }
      .cover-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cover-icon.open {
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
      }
      .cover-meta {
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
      .cover-actions {
        display: flex;
        gap: 6px;
      }
      .ctrl-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .ctrl-btn:hover {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
      }
      .position-rail {
        position: relative;
        height: 10px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .position-fill {
        height: 100%;
        background: var(--aurora-accent-color);
        border-radius: 5px;
        transition: width 0.1s ease;
      }
      .position-rail input[type='range'] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        margin: 0;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraCoverCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraCoverCard.prototype, "config", void 0);
__decorate([
    state()
], AuroraCoverCard.prototype, "_dragPos", void 0);
AuroraCoverCard = __decorate([
    customElement('aurora-cover-card')
], AuroraCoverCard);
export { AuroraCoverCard };
