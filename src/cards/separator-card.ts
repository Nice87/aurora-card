import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-separator-card')
export class AuroraSeparatorCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config) return html``;

    const name = this.config.name || 'Section';
    const icon = this.config.icon;

    return html`
      <div class="separator-wrapper">
        ${icon
          ? html`
              <div class="sep-icon">
                <ha-icon .icon="${icon}"></ha-icon>
              </div>
            `
          : ''}
        <span class="sep-title">${name}</span>
        <div class="sep-line"></div>
        ${this.config.sub_button && this.config.sub_button.length > 0
          ? html`
              <div class="sep-sub-buttons">
                ${this.config.sub_button.map((sub) => {
                  const stateObj = sub.entity ? this.hass?.states[sub.entity] : undefined;
                  return html`
                    <button
                      class="sep-sub-btn"
                      @click="${() => handleAction(this, this.hass, sub, 'tap')}"
                    >
                      ${sub.icon ? html`<ha-icon .icon="${sub.icon}"></ha-icon>` : ''}
                      ${sub.show_state && stateObj ? html`<span>${stateObj.state}</span>` : ''}
                    </button>
                  `;
                })}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static styles = [
    LuminaThemeStyles,
    css`
      .separator-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 4px;
        color: var(--aurora-text-primary);
      }
      .sep-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--aurora-accent-color);
      }
      .sep-title {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.4px;
        white-space: nowrap;
      }
      .sep-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.18) 0%,
          rgba(255, 255, 255, 0.03) 100%
        );
      }
      .sep-sub-buttons {
        display: flex;
        gap: 6px;
      }
      .sep-sub-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 14px;
        background: var(--aurora-card-background);
        border: var(--aurora-card-border);
        color: var(--aurora-text-secondary);
        font-size: 12px;
        cursor: pointer;
      }
    `,
  ];
}