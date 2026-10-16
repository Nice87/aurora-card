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
let AuroraButtonCard = class AuroraButtonCard extends LitElement {
    constructor() {
        super(...arguments);
        this._sliderValue = null;
    }
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const entityId = this.config.entity;
        const stateObj = entityId ? this.hass.states[entityId] : undefined;
        const stateStr = stateObj ? stateObj.state : 'unavailable';
        const isOn = ['on', 'open', 'playing', 'home', 'unlocked', 'active'].includes(stateStr);
        const buttonType = this.config.button_type || 'switch';
        const name = this.config.name || stateObj?.attributes.friendly_name || 'Aurora Button';
        const icon = this.config.icon || stateObj?.attributes.icon || 'mdi:radiobox-marked';
        const currentPercentage = this._getEntityPercentage(stateObj);
        const displayPercent = this._sliderValue !== null ? this._sliderValue : currentPercentage;
        return html `
      <ha-card class="${isOn ? 'is-on' : 'is-off'} mode-${buttonType}">
        ${buttonType === 'slider'
            ? html `
              <div class="slider-fill" style="width: ${displayPercent}%"></div>
              <input
                type="range"
                class="range-input"
                min="0"
                max="100"
                .value="${String(displayPercent)}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            `
            : ''}

        <div class="card-content" @click="${this._onMainClick}">
          <div class="icon-container ${isOn ? 'active' : ''}" @click="${this._onIconClick}">
            <ha-icon .icon="${icon}"></ha-icon>
          </div>

          <div class="info-container">
            <span class="title">${name}</span>
            <div class="secondary-line">
              ${this.config.show_state !== false && stateObj
            ? html `<span class="state">${stateStr}</span>`
            : ''}
              ${buttonType === 'slider'
            ? html `<span class="percent-badge">${Math.round(displayPercent)}%</span>`
            : ''}
              ${this.config.show_attribute && this.config.attribute && stateObj?.attributes[this.config.attribute] !== undefined
            ? html `<span class="attr">• ${stateObj.attributes[this.config.attribute]}</span>`
            : ''}
            </div>
          </div>

          ${this.config.sub_button && this.config.sub_button.length > 0
            ? html `
                <div class="sub-buttons-stack" @click="${(e) => e.stopPropagation()}">
                  ${this.config.sub_button.map((sub) => this._renderSubButton(sub))}
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
    }
    _renderSubButton(sub) {
        const subStateObj = sub.entity ? this.hass.states[sub.entity] : undefined;
        const isSubOn = subStateObj && ['on', 'open', 'playing', 'active'].includes(subStateObj.state);
        const subIcon = sub.icon || subStateObj?.attributes.icon || 'mdi:circle-medium';
        return html `
      <button
        class="sub-btn ${isSubOn ? 'sub-on' : ''} ${sub.show_background === false ? 'no-bg' : ''}"
        @click="${() => handleAction(this, this.hass, sub, 'tap')}"
        title="${sub.name || subStateObj?.attributes.friendly_name || ''}"
      >
        <ha-icon .icon="${subIcon}"></ha-icon>
        ${sub.show_state && subStateObj
            ? html `<span class="sub-state">${subStateObj.state}</span>`
            : ''}
        ${sub.name ? html `<span class="sub-state">${sub.name}</span>` : ''}
      </button>
    `;
    }
    _getEntityPercentage(stateObj) {
        if (!stateObj)
            return 0;
        if (stateObj.attributes.brightness !== undefined) {
            return Math.round((stateObj.attributes.brightness / 255) * 100);
        }
        if (stateObj.attributes.percentage !== undefined) {
            return Number(stateObj.attributes.percentage);
        }
        if (stateObj.attributes.current_position !== undefined) {
            return Number(stateObj.attributes.current_position);
        }
        if (stateObj.attributes.volume_level !== undefined) {
            return Math.round(Number(stateObj.attributes.volume_level) * 100);
        }
        return stateObj.state === 'on' ? 100 : 0;
    }
    _onSliderInput(e) {
        e.stopPropagation();
        const target = e.target;
        this._sliderValue = Number(target.value);
    }
    _onSliderChange(e) {
        e.stopPropagation();
        const target = e.target;
        const val = Number(target.value);
        this._sliderValue = null;
        if (!this.config.entity)
            return;
        const domain = this.config.entity.split('.')[0];
        if (domain === 'light') {
            this.hass.callService('light', 'turn_on', {
                entity_id: this.config.entity,
                brightness_pct: val,
            });
        }
        else if (domain === 'fan') {
            this.hass.callService('fan', 'set_percentage', {
                entity_id: this.config.entity,
                percentage: val,
            });
        }
        else if (domain === 'cover') {
            this.hass.callService('cover', 'set_cover_position', {
                entity_id: this.config.entity,
                position: val,
            });
        }
        else if (domain === 'media_player') {
            this.hass.callService('media_player', 'volume_set', {
                entity_id: this.config.entity,
                volume_level: val / 100,
            });
        }
    }
    _onIconClick(e) {
        e.stopPropagation();
        if (this.config.entity) {
            handleAction(this, this.hass, { entity: this.config.entity, tap_action: { action: 'more-info' } }, 'tap');
        }
    }
    _onMainClick() {
        if (this.config.button_type === 'slider')
            return;
        const defaultAction = this.config.button_type === 'state' ? 'more-info' : 'toggle';
        const configWithDefault = {
            ...this.config,
            tap_action: this.config.tap_action || { action: defaultAction },
        };
        handleAction(this, this.hass, configWithDefault, 'tap');
    }
    static { this.styles = [
        LuminaThemeStyles,
        css `
      ha-card {
        position: relative;
        overflow: hidden;
        background: var(--aurora-card-background);
        backdrop-filter: var(--aurora-card-backdrop-filter);
        -webkit-backdrop-filter: var(--aurora-card-backdrop-filter);
        border: var(--aurora-card-border);
        border-radius: var(--aurora-card-border-radius);
        color: var(--aurora-text-primary);
        padding: 12px 16px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--aurora-card-shadow);
        user-select: none;
      }
      ha-card.is-on {
        border-color: var(--aurora-accent-color);
        box-shadow: 0 8px 28px 0 var(--aurora-accent-glow);
      }
      .slider-fill {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: linear-gradient(90deg, var(--aurora-accent-glow) 0%, rgba(129, 140, 248, 0.38) 100%);
        pointer-events: none;
        transition: width 0.1s ease-out;
        z-index: 0;
      }
      .range-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        z-index: 2;
        margin: 0;
      }
      .card-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .icon-container {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        transition: all 0.25s ease;
        flex-shrink: 0;
      }
      .icon-container.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
        box-shadow: 0 0 16px var(--aurora-accent-glow);
      }
      .info-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .secondary-line {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .percent-badge {
        font-weight: 600;
        color: var(--aurora-accent-color);
      }
      .sub-buttons-stack {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
      }
      .sub-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 36px;
        min-width: 36px;
        padding: 0 10px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
      }
      .sub-btn.sub-on {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
        color: #ffffff;
      }
      .sub-btn.no-bg {
        background: transparent;
        border-color: transparent;
      }
      .sub-btn:hover {
        transform: scale(1.05);
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraButtonCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraButtonCard.prototype, "config", void 0);
__decorate([
    state()
], AuroraButtonCard.prototype, "_sliderValue", void 0);
AuroraButtonCard = __decorate([
    customElement('aurora-button-card')
], AuroraButtonCard);
export { AuroraButtonCard };
