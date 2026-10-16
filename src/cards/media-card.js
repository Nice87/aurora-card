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
let AuroraMediaCard = class AuroraMediaCard extends LitElement {
    constructor() {
        super(...arguments);
        this._volDrag = null;
    }
    render() {
        if (!this.config || !this.hass)
            return html ``;
        const entityId = this.config.entity;
        const stateObj = entityId ? this.hass.states[entityId] : undefined;
        const stateStr = stateObj ? stateObj.state : 'off';
        const isPlaying = stateStr === 'playing';
        const mediaTitle = stateObj?.attributes.media_title ||
            this.config.name ||
            stateObj?.attributes.friendly_name ||
            'Media Player';
        const mediaArtist = stateObj?.attributes.media_artist || stateStr;
        const artwork = stateObj?.attributes.entity_picture;
        const vol = this._volDrag !== null
            ? this._volDrag
            : Math.round((stateObj?.attributes.volume_level ?? 0.5) * 100);
        return html `
      <ha-card class="${isPlaying ? 'playing' : ''}">
        ${artwork
            ? html `<div class="artwork-bg" style="background-image: url('${artwork}')"></div>`
            : ''}

        <div class="media-content">
          <div class="media-top">
            <div
              class="album-thumb"
              @click="${() => handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap')}"
            >
              ${artwork
            ? html `<img src="${artwork}" alt="Album Art" />`
            : html `<ha-icon icon="mdi:music-note"></ha-icon>`}
            </div>

            <div class="track-info">
              <span class="track-title">${mediaTitle}</span>
              <span class="track-artist">${mediaArtist}</span>
            </div>

            <div class="transport-controls">
              <button class="t-btn" @click="${() => this._mediaCmd('media_previous_track')}">
                <ha-icon icon="mdi:skip-previous"></ha-icon>
              </button>
              <button class="t-btn play-btn" @click="${() => this._mediaCmd('media_play_pause')}">
                <ha-icon .icon="${isPlaying ? 'mdi:pause' : 'mdi:play'}"></ha-icon>
              </button>
              <button class="t-btn" @click="${() => this._mediaCmd('media_next_track')}">
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </button>
            </div>
          </div>

          <div class="volume-row">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <div class="vol-slider-wrap">
              <div class="vol-fill" style="width: ${vol}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                .value="${String(vol)}"
                @input="${(e) => {
            this._volDrag = Number(e.target.value);
        }}"
                @change="${(e) => {
            const v = Number(e.target.value);
            this._volDrag = null;
            if (entityId) {
                this.hass.callService('media_player', 'volume_set', {
                    entity_id: entityId,
                    volume_level: v / 100,
                });
            }
        }}"
              />
            </div>
            <span class="vol-pct">${vol}%</span>
          </div>
        </div>
      </ha-card>
    `;
    }
    _mediaCmd(service) {
        if (!this.config.entity)
            return;
        this.hass.callService('media_player', service, { entity_id: this.config.entity });
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
        box-shadow: var(--aurora-card-shadow);
      }
      ha-card.playing {
        border-color: var(--aurora-accent-color);
      }
      .artwork-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: blur(26px) brightness(0.45);
        transform: scale(1.15);
        z-index: 0;
        opacity: 0.65;
      }
      .media-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .media-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .album-thumb {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
      }
      .album-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .track-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .track-artist {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
      }
      .transport-controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .t-btn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: var(--aurora-text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .t-btn.play-btn {
        width: 40px;
        height: 40px;
        background: var(--aurora-accent-color);
        color: #ffffff;
      }
      .volume-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--aurora-text-secondary);
        font-size: 12px;
      }
      .vol-slider-wrap {
        position: relative;
        flex: 1;
        height: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .vol-fill {
        height: 100%;
        background: var(--aurora-accent-color);
      }
      .vol-slider-wrap input[type='range'] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: ew-resize;
        margin: 0;
      }
      .vol-pct {
        min-width: 32px;
        text-align: right;
      }
    `,
    ]; }
};
__decorate([
    property({ attribute: false })
], AuroraMediaCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], AuroraMediaCard.prototype, "config", void 0);
__decorate([
    state()
], AuroraMediaCard.prototype, "_volDrag", void 0);
AuroraMediaCard = __decorate([
    customElement('aurora-media-card')
], AuroraMediaCard);
export { AuroraMediaCard };
