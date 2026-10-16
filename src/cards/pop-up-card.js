var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';
let AuroraPopUpCard = class AuroraPopUpCard extends LitElement {
    constructor() {
        super(...arguments);
        this._isOpen = false;
        this._childCards = [];
        this._boundHashListener = () => this._checkHash();
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('hashchange', this._boundHashListener);
        window.addEventListener('location-changed', this._boundHashListener);
        this._checkHash();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('hashchange', this._boundHashListener);
        window.removeEventListener('location-changed', this._boundHashListener);
        this._clearTimer();
    }
    updated(changedProps) {
        if (changedProps.has('config') && this.config?.cards) {
            this._buildChildCards();
        }
        if (changedProps.has('hass') && this._childCards.length > 0) {
            this._childCards.forEach((card) => {
                if (card)
                    card.hass = this.hass;
            });
        }
    }
    async _buildChildCards() {
        if (!this.config?.cards || !Array.isArray(this.config.cards)) {
            this._childCards = [];
            return;
        }
        const helpers = await window.loadCardHelpers?.();
        const built = [];
        for (const cardCfg of this.config.cards) {
            try {
                let el;
                if (helpers) {
                    el = await helpers.createCardElement(cardCfg);
                }
                else {
                    const tag = cardCfg.type.startsWith('custom:')
                        ? cardCfg.type.replace('custom:', '')
                        : `hui-${cardCfg.type}-card`;
                    el = document.createElement(tag);
                    if (el.setConfig)
                        el.setConfig(cardCfg);
                }
                if (this.hass)
                    el.hass = this.hass;
                built.push(el);
            }
            catch (err) {
                console.error('Aurora Pop-up child card error:', err);
            }
        }
        this._childCards = built;
    }
    _checkHash() {
        const targetHash = this.config?.hash || '#aurora-popup';
        const normalizedTarget = targetHash.startsWith('#') ? targetHash : `#${targetHash}`;
        const shouldOpen = window.location.hash === normalizedTarget;
        if (shouldOpen !== this._isOpen) {
            this._isOpen = shouldOpen;
            if (this._isOpen && this.config?.auto_close) {
                this._clearTimer();
                this._autoCloseTimer = window.setTimeout(() => {
                    this._closePopUp();
                }, this.config.auto_close);
            }
            else {
                this._clearTimer();
            }
        }
    }
    _clearTimer() {
        if (this._autoCloseTimer) {
            clearTimeout(this._autoCloseTimer);
            this._autoCloseTimer = undefined;
        }
    }
    _closePopUp() {
        this._clearTimer();
        if (window.location.hash === (this.config?.hash || '#aurora-popup')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
            fireEvent(window, 'location-changed', {});
        }
        this._isOpen = false;
    }
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const targetHash = this.config.hash || '#aurora-popup';
        const stateObj = this.config.entity ? this.hass.states[this.config.entity] : undefined;
        const title = this.config.name || stateObj?.attributes.friendly_name || 'Aurora Pop-up';
        const icon = this.config.icon || stateObj?.attributes.icon || 'mdi:layers-triple-outline';
        return html `
      <!-- Compact trigger bar always visible in editor or dashboard to open the Pop-up -->
      <div class="popup-trigger-bar" @click="${() => this._openPopUp(targetHash)}">
        <div class="trigger-left">
          <ha-icon .icon="${icon}"></ha-icon>
          <span>${title}</span>
          <span class="hash-pill">${targetHash}</span>
        </div>
        <ha-icon icon="mdi:arrow-expand-all"></ha-icon>
      </div>

      ${this._isOpen
            ? html `
            <div
              class="popup-backdrop"
              style="--popup-blur: ${this.config.backdrop_blur ?? 18}px"
              @click="${this._closePopUp}"
            >
              <div
                class="popup-sheet"
                @click="${(e) => {
                e.stopPropagation();
                if (this.config.close_on_click)
                    this._closePopUp();
            }}"
              >
                <div class="sheet-handle-bar" @click="${this._closePopUp}">
                  <div class="sheet-pill"></div>
                </div>

                <div class="sheet-header">
                  <div class="header-main" @click="${() => handleAction(this, this.hass, this.config, 'tap')}">
                    <div class="header-icon">
                      <ha-icon .icon="${icon}"></ha-icon>
                    </div>
                    <div class="header-titles">
                      <span class="header-name">${title}</span>
                      ${stateObj
                ? html `<span class="header-state">${stateObj.state}</span>`
                : ''}
                    </div>
                  </div>

                  <button class="close-btn" @click="${this._closePopUp}">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>

                <div class="sheet-body">
                  ${this._childCards.length > 0
                ? this._childCards.map((cardEl) => html `<div class="child-card-slot">${cardEl}</div>`)
                : html `
                        <div class="empty-hint">
                          Pop-up active (${targetHash}). Add child cards via the <code>cards:</code> array in YAML or the editor.
                        </div>
                      `}
                </div>
              </div>
            </div>
          `
            : ''}
    `;
    }
    _openPopUp(hash) {
        const formatted = hash.startsWith('#') ? hash : `#${hash}`;
        window.location.hash = formatted;
        fireEvent(window, 'location-changed', {});
    }
    static { this.styles = [
        LuminaThemeStyles,
        css `
      .popup-trigger-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-radius: var(--aurora-card-border-radius);
        background: var(--aurora-card-background);
        border: 1px dashed rgba(129, 140, 248, 0.35);
        color: var(--aurora-text-primary);
        cursor: pointer;
        font-size: 13px;
      }
      .trigger-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .hash-pill {
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        font-family: monospace;
        font-size: 11px;
      }
      .popup-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(8, 12, 24, 0.65);
        backdrop-filter: blur(var(--popup-blur, 18px)) saturate(160%);
        -webkit-backdrop-filter: blur(var(--popup-blur, 18px)) saturate(160%);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        animation: fadeIn 0.22s ease-out;
      }
      @media (min-width: 768px) {
        .popup-backdrop {
          align-items: center;
        }
      }
      .popup-sheet {
        width: 100%;
        max-width: 540px;
        max-height: 86vh;
        background: var(--aurora-card-background);
        border: var(--aurora-card-border);
        border-radius: 28px 28px 0 0;
        padding: 12px 18px 24px 18px;
        box-shadow: 0 -10px 50px rgba(0, 0, 0, 0.65);
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
        animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @media (min-width: 768px) {
        .popup-sheet {
          border-radius: 28px;
        }
      }
      .sheet-handle-bar {
        display: flex;
        justify-content: center;
        padding: 4px 0;
        cursor: pointer;
      }
      .sheet-pill {
        width: 42px;
        height: 5px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.25);
      }
      .sheet-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .header-main {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .header-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
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
      .header-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--aurora-text-primary);
      }
      .header-state {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .close-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .sheet-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .empty-hint {
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: var(--aurora-text-secondary);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: 14px;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(40px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraPopUpCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraPopUpCard.prototype, "config", void 0);
__decorate([
    state()
], AuroraPopUpCard.prototype, "_isOpen", void 0);
__decorate([
    state()
], AuroraPopUpCard.prototype, "_childCards", void 0);
AuroraPopUpCard = __decorate([
    customElement('aurora-pop-up-card')
], AuroraPopUpCard);
export { AuroraPopUpCard };
