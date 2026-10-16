var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';
let AuroraEnergyFlowCard = class AuroraEnergyFlowCard extends LitElement {
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const solarVal = this._readVal(this.config.solar_entity);
        const gridVal = this._readVal(this.config.grid_entity || this.config.entity);
        const batteryVal = this._readVal(this.config.battery_entity);
        const homeVal = this.config.home_entity
            ? this._readVal(this.config.home_entity)
            : Math.max(0, solarVal + gridVal);
        const tariffState = this.config.tariff_entity
            ? this.hass.states[this.config.tariff_entity]?.state
            : undefined;
        const title = this.config.name || 'Energy Flow Matrix';
        return html `
      <ha-card>
        <div class="energy-header">
          <div class="header-left">
            <ha-icon .icon="${this.config.icon || 'mdi:transmission-tower'}"></ha-icon>
            <span class="title">${title}</span>
          </div>
          ${tariffState
            ? html `<span class="tariff-badge">${tariffState}</span>`
            : html `<span class="tariff-badge">Live Telemetry</span>`}
        </div>

        <div class="flow-grid">
          <!-- Solar Node -->
          <div
            class="node solar ${solarVal > 0 ? 'active' : ''}"
            @click="${() => this._openMoreInfo(this.config.solar_entity)}"
          >
            <ha-icon icon="mdi:solar-power-variant"></ha-icon>
            <span class="node-label">Solar</span>
            <span class="node-val">${solarVal} W</span>
          </div>

          <!-- Grid Node -->
          <div
            class="node grid ${gridVal !== 0 ? 'active' : ''}"
            @click="${() => this._openMoreInfo(this.config.grid_entity || this.config.entity)}"
          >
            <ha-icon icon="mdi:transmission-tower"></ha-icon>
            <span class="node-label">${gridVal < 0 ? 'Export' : 'Grid'}</span>
            <span class="node-val">${Math.abs(gridVal)} W</span>
          </div>

          <!-- Home Consumption Node -->
          <div
            class="node home active"
            @click="${() => this._openMoreInfo(this.config.home_entity)}"
          >
            <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
            <span class="node-label">Home</span>
            <span class="node-val">${homeVal} W</span>
          </div>

          <!-- Battery / Storage Node -->
          <div
            class="node battery ${batteryVal > 0 ? 'active' : ''}"
            @click="${() => this._openMoreInfo(this.config.battery_entity)}"
          >
            <ha-icon icon="mdi:battery-charging-80"></ha-icon>
            <span class="node-label">Storage</span>
            <span class="node-val">${batteryVal}${this.config.battery_entity?.includes('soc') ? '%' : ' W'}</span>
          </div>
        </div>

        <div class="distribution-bar">
          <div
            class="seg solar-seg"
            style="flex: ${Math.max(1, solarVal)}"
            title="Solar Contribution"
          ></div>
          <div
            class="seg grid-seg"
            style="flex: ${Math.max(1, Math.abs(gridVal))}"
            title="Grid Contribution"
          ></div>
        </div>
      </ha-card>
    `;
    }
    _readVal(entityId) {
        if (!entityId || !this.hass.states[entityId])
            return 0;
        const n = parseFloat(this.hass.states[entityId].state);
        return isNaN(n) ? 0 : Math.round(n);
    }
    _openMoreInfo(entityId) {
        if (!entityId)
            return;
        handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap');
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
        padding: 16px;
        box-shadow: var(--aurora-card-shadow);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .energy-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .header-left {
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
      .tariff-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        background: rgba(16, 185, 129, 0.16);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      .flow-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 6px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.07);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .node:hover {
        transform: translateY(-2px);
        border-color: var(--aurora-accent-color);
      }
      .node.solar.active ha-icon {
        color: #facc15;
      }
      .node.grid.active ha-icon {
        color: #38bdf8;
      }
      .node.home.active ha-icon {
        color: var(--aurora-accent-color);
      }
      .node.battery.active ha-icon {
        color: #34d399;
      }
      .node-label {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .node-val {
        font-size: 13px;
        font-weight: 700;
      }
      .distribution-bar {
        display: flex;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        gap: 3px;
        background: rgba(255, 255, 255, 0.06);
      }
      .solar-seg {
        background: #facc15;
      }
      .grid-seg {
        background: #38bdf8;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraEnergyFlowCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraEnergyFlowCard.prototype, "config", void 0);
AuroraEnergyFlowCard = __decorate([
    customElement('aurora-energy-flow-card')
], AuroraEnergyFlowCard);
export { AuroraEnergyFlowCard };
