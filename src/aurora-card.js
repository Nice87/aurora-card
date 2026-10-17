var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { executeAuroraAction, } from './utils/hass-connect';
import { AuroraModuleManager } from './modules/module-manager';
import './editor/editor-base';
let AuroraCard = class AuroraCard extends LitElement {
    constructor() {
        super(...arguments);
        this._sliderTempValue = null;
        this._subButtonsCollapsed = false;
        this._holdTimer = null;
        this._holdTriggered = false;
    }
    static async getConfigElement() {
        return document.createElement('aurora-card-editor');
    }
    static getStubConfig() {
        return {
            type: 'custom:aurora-card',
            card_type: 'button',
            button_type: 'switch',
            scrolling_effect: true,
            show_icon: true,
            show_name: true,
            state_content: ['state'],
        };
    }
    setConfig(config) {
        if (!config) {
            throw new Error('Invalid Aurora Card configuration');
        }
        this._config = {
            card_type: 'button',
            button_type: 'switch',
            scrolling_effect: true,
            show_icon: true,
            prioritise_icon: false,
            show_name: true,
            state_content: ['state'],
            ...config,
        };
        AuroraModuleManager.syncGlobalConfigFromCard(this._config);
    }
    getCardSize() {
        return 1;
    }
    _isEntityActive(entityId) {
        if (!entityId || !this.hass || !this.hass.states[entityId])
            return false;
        const st = this.hass.states[entityId].state;
        return (st === 'on' ||
            st === 'playing' ||
            st === 'open' ||
            st === 'heat' ||
            st === 'cool' ||
            st === 'heating' ||
            st === 'home');
    }
    _resolveIcon(entityId, customIcon) {
        if (customIcon)
            return customIcon;
        if (entityId && this.hass && this.hass.states[entityId]) {
            const attrIcon = this.hass.states[entityId].attributes.icon;
            if (attrIcon)
                return String(attrIcon);
        }
        const domain = entityId ? entityId.split('.')[0] : '';
        const map = {
            light: 'mdi:lightbulb',
            switch: 'mdi:power',
            climate: 'mdi:thermostat',
            media_player: 'mdi:speaker',
            cover: 'mdi:window-shutter',
            sensor: 'mdi:eye-outline',
            binary_sensor: 'mdi:radiobox-marked',
        };
        return map[domain] ? map[domain] : 'mdi:aurora';
    }
    _resolveName(entityId, customName) {
        if (customName)
            return customName;
        if (entityId && this.hass && this.hass.states[entityId]) {
            const friendly = this.hass.states[entityId].attributes.friendly_name;
            if (friendly)
                return String(friendly);
        }
        return entityId ? entityId : 'Aurora Card';
    }
    _resolveFormattedState(entityId) {
        if (!entityId || !this.hass || !this.hass.states[entityId])
            return '';
        const stateObj = this.hass.states[entityId];
        const chips = this._config?.state_content ?? ['state'];
        const parts = [];
        for (const chipKey of chips) {
            if (chipKey === 'state') {
                const unit = stateObj.attributes.unit_of_measurement ?? '';
                parts.push(unit ? `${stateObj.state}${unit}` : stateObj.state);
            }
            else if (stateObj.attributes[chipKey] !== undefined) {
                parts.push(String(stateObj.attributes[chipKey]));
            }
        }
        return parts.join(' • ');
    }
    _resolveNumericSliderPercent(entityId) {
        if (this._sliderTempValue !== null)
            return this._sliderTempValue;
        if (!entityId || !this.hass || !this.hass.states[entityId])
            return 0;
        const stateObj = this.hass.states[entityId];
        if (stateObj.attributes.brightness !== undefined) {
            return Math.round((Number(stateObj.attributes.brightness) / 255) * 100);
        }
        if (stateObj.attributes.volume_level !== undefined) {
            return Math.round(Number(stateObj.attributes.volume_level) * 100);
        }
        if (stateObj.attributes.current_position !== undefined) {
            return Number(stateObj.attributes.current_position);
        }
        const parsed = parseFloat(stateObj.state);
        if (!Number.isNaN(parsed)) {
            return Math.max(0, Math.min(100, parsed));
        }
        return this._isEntityActive(entityId) ? 100 : 0;
    }
    _onSliderInput(e) {
        e.stopPropagation();
        const val = Number(e.target.value);
        this._sliderTempValue = val;
    }
    _onSliderChange(e) {
        e.stopPropagation();
        const val = Number(e.target.value);
        this._sliderTempValue = null;
        const entityId = this._config?.entity ?? '';
        if (!entityId || !this.hass)
            return;
        const domain = entityId.split('.')[0];
        if (domain === 'light') {
            this.hass.callService('light', 'turn_on', {
                entity_id: entityId,
                brightness_pct: val,
            });
        }
        else if (domain === 'media_player') {
            this.hass.callService('media_player', 'volume_set', {
                entity_id: entityId,
                volume_level: val / 100,
            });
        }
        else if (domain === 'cover') {
            this.hass.callService('cover', 'set_cover_position', {
                entity_id: entityId,
                position: val,
            });
        }
        else if (domain === 'input_number' || domain === 'number') {
            this.hass.callService(domain, 'set_value', {
                entity_id: entityId,
                value: val,
            });
        }
    }
    _handlePointerDown() {
        this._holdTriggered = false;
        this._holdTimer = window.setTimeout(() => {
            this._holdTriggered = true;
            if (this._config && this.hass) {
                executeAuroraAction(this, this.hass, this._config, this._config.hold_action ?? { action: 'more-info' });
            }
        }, 520);
    }
    _handlePointerUp() {
        if (this._holdTimer !== null) {
            clearTimeout(this._holdTimer);
            this._holdTimer = null;
        }
    }
    _handleCardClick() {
        if (this._holdTriggered) {
            this._holdTriggered = false;
            return;
        }
        if (!this._config || !this.hass)
            return;
        executeAuroraAction(this, this.hass, this._config, this._config.tap_action);
    }
    _handleIconClick(e) {
        e.stopPropagation();
        if (!this._config || !this.hass)
            return;
        executeAuroraAction(this, this.hass, this._config, this._config.icon_tap_action ?? this._config.tap_action);
    }
    render() {
        if (!this._config)
            return html ``;
        const cardType = this._config.card_type ?? 'button';
        if (cardType === 'empty-column') {
            return html `<div class="aurora-empty-column"></div>`;
        }
        const entityId = this._config.entity ?? '';
        const isOn = this._isEntityActive(entityId);
        const dynamicCss = AuroraModuleManager.generateDynamicStyles(this.hass, this._config);
        const hideDefault = AuroraModuleManager.shouldHideDefaultContent(this._config);
        const isSlider = this._config.button_type === 'slider';
        const sliderPct = isSlider ? this._resolveNumericSliderPercent(entityId) : 0;
        return html `
      <style>
        ${dynamicCss}
      </style>
      <div
        class="aurora-card-surface"
        ?data-state-on="${isOn}"
        @pointerdown="${this._handlePointerDown}"
        @pointerup="${this._handlePointerUp}"
        @pointercancel="${this._handlePointerUp}"
        @click="${this._handleCardClick}"
      >
        <!-- Module Extension: Card Backdrop Image Layer -->
        ${AuroraModuleManager.renderBackdropLayer(this._config)}

        <!-- Optional Range Slider Fill Track -->
        ${isSlider
            ? html `
              <div class="aurora-slider-fill" style="width: ${sliderPct}%;"></div>
              <input
                type="range"
                class="aurora-slider-overlay-input"
                min="0"
                max="100"
                .value="${String(sliderPct)}"
                @click="${(e) => e.stopPropagation()}"
                @input="${this._onSliderInput}"
                @change="${this._onSliderChange}"
              />
            `
            : html ``}

        <!-- Main Card Foreground Content (Hidden if Multi Section Card hides default) -->
        ${!hideDefault ? this._renderMainContent(entityId) : html ``}

        <!-- Module Extension: Multi Section Card (2, 3, or 4 sections) -->
        ${AuroraModuleManager.renderMultiSectionExtension(this, this.hass, this._config, (ent, ic) => this._resolveIcon(ent, ic), (ent, nm) => this._resolveName(ent, nm), (ent) => this._resolveFormattedState(ent))}
      </div>
    `;
    }
    _renderMainContent(entityId) {
        const showIcon = this._config?.show_icon !== false;
        const showName = this._config?.show_name !== false;
        const scrolling = this._config?.scrolling_effect !== false;
        const prioritiseIcon = Boolean(this._config?.prioritise_icon);
        const stateObj = entityId && this.hass?.states ? this.hass.states[entityId] : undefined;
        const entityPic = stateObj?.attributes?.entity_picture;
        const usePicture = Boolean(entityPic && !prioritiseIcon);
        const icon = this._resolveIcon(entityId, this._config?.icon);
        const title = this._resolveName(entityId, this._config?.name);
        const stateText = this._resolveFormattedState(entityId);
        const subButtons = this._config?.sub_button ?? [];
        const activeModIds = AuroraModuleManager.getActiveModuleIds(this._config);
        const collapsibleSubs = activeModIds.includes('collapsible_sub_button_groups');
        return html `
      <div class="aurora-foreground-row">
        ${showIcon
            ? html `
              <div class="aurora-main-icon-wrap" @click="${this._handleIconClick}">
                ${AuroraModuleManager.renderIconProgressRing(this.hass, this._config)}${usePicture
                ? html `<img class="entity-avatar-img" src="${entityPic}" alt="" />`
                : html `<ha-icon .icon="${icon}"></ha-icon>`}
              </div>
            `
            : html ``}

        <div class="aurora-title-state-col" ?data-scrolling="${scrolling}">
          ${showName ? html `<span class="aurora-card-title">${title}</span>` : html ``}
          ${stateText ? html `<span class="aurora-card-state">${stateText}</span>` : html ``}
        </div>

        ${subButtons.length > 0
            ? html `
              <div class="aurora-sub-buttons-bar">
                ${collapsibleSubs
                ? html `
                      <button
                        type="button"
                        class="aurora-sub-pill drawer-toggle-pill"
                        @click="${(e) => {
                    e.stopPropagation();
                    this._subButtonsCollapsed = !this._subButtonsCollapsed;
                }}"
                      >
                        <ha-icon
                          .icon="${this._subButtonsCollapsed
                    ? 'mdi:dots-horizontal'
                    : 'mdi:chevron-right'}"
                        ></ha-icon>
                      </button>
                    `
                : html ``}
                ${!this._subButtonsCollapsed
                ? subButtons.map((sub) => this._renderSubButtonPill(sub))
                : html ``}
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderSubButtonPill(sub) {
        const subEnt = sub.entity ?? this._config?.entity ?? '';
        const subIcon = this._resolveIcon(subEnt, sub.icon);
        const subActive = this._isEntityActive(subEnt);
        const subState = sub.show_state && subEnt && this.hass?.states?.[subEnt]
            ? this.hass.states[subEnt].state
            : '';
        return html `
      <button
        type="button"
        class="aurora-sub-pill"
        ?data-sub-active="${subActive}"
        @click="${(e) => {
            e.stopPropagation();
            if (this._config && this.hass) {
                executeAuroraAction(this, this.hass, this._config, sub.tap_action ?? { action: 'toggle' }, subEnt);
            }
        }}"
      >
        <ha-icon .icon="${subIcon}"></ha-icon>
        ${subState ? html `<span class="sub-pill-state">${subState}</span>` : html ``}
      </button>
    `;
    }
    static { this.styles = css `
    :host {
      display: block;
      --aurora-accent: var(--primary-color, #38bdf8);
    }

    .aurora-empty-column {
      min-height: 12px;
    }

    .aurora-card-surface {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 56px;
      padding: 10px 14px;
      border-radius: 28px;
      background: rgba(30, 41, 59, 0.72);
      backdrop-filter: blur(18px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #f8fafc);
      overflow: hidden;
      cursor: pointer;
      user-select: none;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
    }

    .aurora-card-surface[data-state-on] {
      border-color: rgba(56, 189, 248, 0.45);
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15);
    }

    /* Card Backdrop Image Module Layer */
    .aurora-backdrop-container {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .aurora-backdrop-image,
    .aurora-backdrop-overlay {
      position: absolute;
      inset: 0;
    }

    /* Slider Track & Input */
    .aurora-slider-fill {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      background: rgba(56, 189, 248, 0.28);
      pointer-events: none;
      transition: width 0.1s ease-out;
    }

    .aurora-slider-overlay-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 3;
      cursor: ew-resize;
      margin: 0;
    }

    /* Foreground Row */
    .aurora-foreground-row {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .aurora-main-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      color: var(--secondary-text-color, #94a3b8);
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
      background: rgba(56, 189, 248, 0.22);
      color: var(--aurora-accent, #38bdf8);
    }

    .entity-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .aurora-icon-progress-svg {
      position: absolute;
      inset: -3px;
      width: 44px;
      height: 44px;
      transform: rotate(-90deg);
      pointer-events: none;
    }

    .ring-track {
      stroke: rgba(255, 255, 255, 0.12);
    }

    .ring-fill {
      stroke: var(--aurora-accent, #38bdf8);
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }

    .aurora-title-state-col {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      min-width: 0;
    }

    .aurora-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .aurora-card-state {
      font-size: 12px;
      color: var(--secondary-text-color, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Sub-Buttons Bar */
    .aurora-sub-buttons-bar {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .aurora-sub-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 34px;
      padding: 0 10px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--primary-text-color, #f8fafc);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      --mdc-icon-size: 18px;
      transition: all 0.15s ease;
    }

    .aurora-sub-pill[data-sub-active] {
      background: rgba(56, 189, 248, 0.25);
      border-color: var(--aurora-accent, #38bdf8);
      color: #ffffff;
    }

    /* Multi Section Card Module Grid */
    .aurora-multi-section-grid {
      position: relative;
      z-index: 2;
      display: grid;
      gap: 8px;
      width: 100%;
    }

    .aurora-multi-sec-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .aurora-multi-sec-cell:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    .sec-cell-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
      --mdc-icon-size: 17px;
    }

    .sec-cell-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .sec-cell-name {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sec-cell-state {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `; }
};
__decorate([
    property({ attribute: false })
], AuroraCard.prototype, "hass", void 0);
__decorate([
    state()
], AuroraCard.prototype, "_config", void 0);
__decorate([
    state()
], AuroraCard.prototype, "_sliderTempValue", void 0);
__decorate([
    state()
], AuroraCard.prototype, "_subButtonsCollapsed", void 0);
AuroraCard = __decorate([
    customElement('aurora-card')
], AuroraCard);
export { AuroraCard };
window.customCards = window.customCards || [];
window.customCards.push({
    type: "aurora-card",
    name: "Aurora Card",
    description: "A high-performance modular card inspired by Bubble Card.",
    preview: true, // Optional: enables visual preview in the card picker
});
