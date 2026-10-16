var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LuminaThemeStyles } from '../styles/lumina-theme';
let AuroraRoutineMacroCard = class AuroraRoutineMacroCard extends LitElement {
    constructor() {
        super(...arguments);
        this._executing = false;
        this._currentStepIndex = 0;
    }
    setConfig(config) {
        this.config = config;
    }
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const stateObj = this.config.entity ? this.hass.states[this.config.entity] : undefined;
        const name = this.config.name || stateObj?.attributes.friendly_name || 'Routine Macro';
        const icon = this.config.icon || stateObj?.attributes.icon || 'mdi:flash-auto';
        const steps = this.config.macro_steps || [];
        const totalSteps = steps.length > 0 ? steps.length : 1;
        const progressPct = this._executing ? Math.round(((this._currentStepIndex + 1) / totalSteps) * 100) : 0;
        return html `
      <ha-card class="${this._executing ? 'is-running' : ''}" @click="${this._runSequence}">
        <div class="progress-bar" style="width: ${progressPct}%"></div>

        <div class="macro-container">
          <div class="icon-wrapper ${this._executing ? 'pulse' : ''}">
            <ha-icon .icon="${this._executing ? 'mdi:loading' : icon}"></ha-icon>
          </div>

          <div class="macro-info">
            <span class="title">${name}</span>
            <span class="subtitle">
              ${this._executing
            ? `Executing step ${this._currentStepIndex + 1} of ${totalSteps}...`
            : steps.length > 0
                ? `${steps.length} sequential actions ready`
                : stateObj
                    ? `Target: ${stateObj.entity_id}`
                    : 'Tap to trigger macro'}
            </span>
          </div>

          <div class="badge-pill">
            ${this._executing ? `${progressPct}%` : 'RUN'}
          </div>
        </div>
      </ha-card>
    `;
    }
    async _runSequence() {
        if (this._executing || !this.hass || !this.config)
            return;
        this._executing = true;
        this._currentStepIndex = 0;
        const steps = this.config.macro_steps && this.config.macro_steps.length > 0
            ? this.config.macro_steps
            : [
                {
                    service: this.config.tap_action?.service ||
                        (this.config.entity?.startsWith('scene.') ? 'scene.turn_on' : 'homeassistant.toggle'),
                    entity_id: this.config.entity,
                    data: this.config.tap_action?.service_data,
                },
            ];
        try {
            for (let i = 0; i < steps.length; i++) {
                this._currentStepIndex = i;
                const step = steps[i];
                if (step.service) {
                    const [domain, srv] = step.service.split('.');
                    const payload = { ...(step.data || {}) };
                    if (step.entity_id && !payload.entity_id) {
                        payload.entity_id = step.entity_id;
                    }
                    await this.hass.callService(domain, srv, payload);
                }
                if (step.delay_ms && step.delay_ms > 0) {
                    await new Promise((r) => setTimeout(r, step.delay_ms));
                }
            }
        }
        catch (err) {
            console.error('Aurora Routine Macro execution error:', err);
        }
        finally {
            setTimeout(() => {
                this._executing = false;
                this._currentStepIndex = 0;
            }, 700);
        }
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
        padding: 14px 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--aurora-card-shadow);
      }
      ha-card:hover,
      ha-card.is-running {
        border-color: var(--aurora-accent-color);
        box-shadow: 0 10px 32px 0 var(--aurora-accent-glow);
      }
      .progress-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        background: var(--aurora-accent-color);
        transition: width 0.25s ease;
      }
      .macro-container {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pulse ha-icon {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }
      .macro-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .badge-pill {
        padding: 5px 12px;
        border-radius: 14px;
        background: rgba(129, 140, 248, 0.18);
        border: 1px solid rgba(129, 140, 248, 0.35);
        color: var(--aurora-accent-color);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.6px;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraRoutineMacroCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraRoutineMacroCard.prototype, "config", void 0);
__decorate([
    state()
], AuroraRoutineMacroCard.prototype, "_executing", void 0);
__decorate([
    state()
], AuroraRoutineMacroCard.prototype, "_currentStepIndex", void 0);
AuroraRoutineMacroCard = __decorate([
    customElement('aurora-routine-macro-card')
], AuroraRoutineMacroCard);
export { AuroraRoutineMacroCard };
