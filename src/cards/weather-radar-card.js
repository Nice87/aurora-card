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
let AuroraWeatherRadarCard = class AuroraWeatherRadarCard extends LitElement {
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const entityId = this.config.entity || 'weather.home';
        const stateObj = this.hass.states[entityId];
        const condition = stateObj ? stateObj.state : 'partlycloudy';
        const temp = stateObj?.attributes.temperature ?? '--';
        const humidity = stateObj?.attributes.humidity ?? '--';
        const windSpeed = stateObj?.attributes.wind_speed ?? '--';
        const dewPoint = this.config.dew_point_entity
            ? this.hass.states[this.config.dew_point_entity]?.state
            : this._calcDewPoint(Number(temp), Number(humidity));
        const vpd = this.config.vpd_entity
            ? this.hass.states[this.config.vpd_entity]?.state
            : this._calcVpd(Number(temp), Number(humidity));
        const thomDi = this.config.discomfort_entity
            ? this.hass.states[this.config.discomfort_entity]?.state
            : this._calcThomDi(Number(temp), Number(humidity));
        return html `
      <ha-card
        @click="${() => handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap')}"
      >
        <div class="weather-top">
          <div class="weather-main">
            <div class="weather-icon">
              <ha-icon .icon="${this.config.icon || 'mdi:weather-partly-cloudy'}"></ha-icon>
            </div>
            <div class="weather-primary">
              <span class="title">${this.config.name || stateObj?.attributes.friendly_name || 'Atmosphere & Microclimate'}</span>
              <span class="condition-text">${condition} • Wind ${windSpeed} km/h</span>
            </div>
          </div>

          <div class="temp-readout">${temp}°</div>
        </div>

        <div class="microclimate-grid">
          <div class="metric-box">
            <span class="m-label">Humidity</span>
            <span class="m-val">${humidity}%</span>
          </div>
          <div class="metric-box">
            <span class="m-label">Dew Point</span>
            <span class="m-val">${dewPoint}°C</span>
          </div>
          <div class="metric-box">
            <span class="m-label">VPD</span>
            <span class="m-val">${vpd} kPa</span>
          </div>
          <div class="metric-box">
            <span class="m-label">Thom DI</span>
            <span class="m-val">${thomDi}</span>
          </div>
        </div>
      </ha-card>
    `;
    }
    _calcDewPoint(t, rh) {
        if (isNaN(t) || isNaN(rh) || rh <= 0)
            return '--';
        const a = 17.27;
        const b = 237.7;
        const alpha = (a * t) / (b + t) + Math.log(rh / 100);
        const dp = (b * alpha) / (a - alpha);
        return dp.toFixed(1);
    }
    _calcVpd(t, rh) {
        if (isNaN(t) || isNaN(rh))
            return '--';
        const svp = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
        const vpd = svp * (1 - rh / 100);
        return vpd.toFixed(2);
    }
    _calcThomDi(t, rh) {
        if (isNaN(t) || isNaN(rh))
            return '--';
        const di = t - 0.55 * (1 - 0.01 * rh) * (t - 14.5);
        return di.toFixed(1);
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
        cursor: pointer;
      }
      .weather-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .weather-main {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .weather-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .weather-primary {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .condition-text {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .temp-readout {
        font-size: 26px;
        font-weight: 700;
        color: var(--aurora-accent-color);
      }
      .microclimate-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .metric-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 6px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.07);
      }
      .m-label {
        font-size: 11px;
        color: var(--aurora-text-secondary);
      }
      .m-val {
        font-size: 13px;
        font-weight: 700;
        margin-top: 2px;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraWeatherRadarCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraWeatherRadarCard.prototype, "config", void 0);
AuroraWeatherRadarCard = __decorate([
    customElement('aurora-weather-radar-card')
], AuroraWeatherRadarCard);
export { AuroraWeatherRadarCard };
