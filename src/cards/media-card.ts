import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-media-card')
export class AuroraMediaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;
  @state() private _volDrag: number | null = null;
  @state() private _seekDrag: number | null = null;
  @state() private _dspDrawerOpen = false;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const entityId = this.config.entity;
    const stateObj = entityId ? this.hass.states[entityId] : undefined;
    const stateStr = stateObj ? stateObj.state : 'off';
    const isPlaying = stateStr === 'playing';

    const mediaTitle =
      stateObj?.attributes.media_title ||
      this.config.name ||
      stateObj?.attributes.friendly_name ||
      'Media Player';
    const mediaArtist = stateObj?.attributes.media_artist || stateStr;
    const artwork = stateObj?.attributes.entity_picture;
    
    const vol =
      this._volDrag !== null
        ? this._volDrag
        : Math.round((stateObj?.attributes.volume_level ?? 0.5) * 100);

    // Master Tape Progress Calculations
    const rawPosition = Number(stateObj?.attributes.media_position ?? 0);
    const updatedAt = stateObj?.attributes.media_position_updated_at;
    const duration = Number(stateObj?.attributes.media_duration ?? 0);

    let position = rawPosition;
    if (isPlaying && updatedAt) {
      const elapsedSeconds = (Date.now() - new Date(updatedAt).getTime()) / 1000;
      if (elapsedSeconds > 0) {
        position = Math.min(duration, rawPosition + elapsedSeconds);
      }
    }

    const currentPct = duration > 0 ? Math.min(100, Math.max(0, (position / duration) * 100)) : 0;
    const displayPct = this._seekDrag !== null ? this._seekDrag : currentPct;
    const displaySeconds = this._seekDrag !== null ? (this._seekDrag / 100) * duration : position;

    return html`
      <ha-card class="${isPlaying ? 'playing' : ''}">
        ${artwork
          ? html`<div class="artwork-bg" style="background-image: url('${artwork}')"></div>`
          : ''}

        <div class="media-content">
          <div class="media-top">
            <div
              class="album-thumb"
              @click="${() =>
                handleAction(this, this.hass, { entity: entityId, tap_action: { action: 'more-info' } }, 'tap')}"
            >
              ${artwork
                ? html`<img src="${artwork}" alt="Album Art" />`
                : html`<ha-icon icon="mdi:music-note"></ha-icon>`}
            </div>

            <div class="track-info">
              <div class="title-row">
                <span class="track-title">${mediaTitle}</span>${this._renderTelemetryBadge(stateObj)}
              </div>
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
              <button 
                class="t-btn dsp-btn ${this._dspDrawerOpen ? 'active' : ''}" 
                @click="${(e: Event) => { e.stopPropagation(); this._dspDrawerOpen = !this._dspDrawerOpen; }}" 
                title="Sound Signatures / DSP"
              >
                <ha-icon icon="mdi:equalizer"></ha-icon>
              </button>
            </div>
          </div>

          <!-- Master Tape Interactive Progress Bar -->
          <div class="progress-section">
            <div class="progress-rail">
              <div class="progress-fill" style="width: ${displayPct}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                .value="${String(displayPct)}"
                @input="${(e: Event) => {
                  this._seekDrag = Number((e.target as HTMLInputElement).value);
                }}"
                @change="${(e: Event) => {
                  const pct = Number((e.target as HTMLInputElement).value);
                  this._seekDrag = null;
                  if (entityId && duration > 0) {
                    const targetPosition = (pct / 100) * duration;
                    this.hass.callService('media_player', 'media_seek', {
                      entity_id: entityId,
                      seek_position: targetPosition,
                    });
                  }
                }}"
              />
            </div>
            <div class="time-row">
              <span>${this._formatTime(position)}</span>
              <span>${this._formatTime(duration)}</span>
            </div>
          </div>

          <!-- DSP Sound Signature Profiles Drawer -->
          ${this._dspDrawerOpen
            ? html`
                <div class="dsp-profiles-drawer" @click="${(e: Event) => e.stopPropagation()}">
                  <span class="dsp-title">DSP Sound Signatures</span>
                  <div class="dsp-pills">
                    <button class="dsp-pill" @click="${() => this._setDspProfile('flat')}">Direct / Flat</button>
                    <button class="dsp-pill" @click="${() => this._setDspProfile('jazz')}">Warm Jazz</button>
                    <button class="dsp-pill" @click="${() => this._setDspProfile('night')}">Night Mode</button>
                  </div>
                </div>
              `
            : ''}

          <div class="volume-row">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <div class="vol-slider-wrap">
              <div class="vol-fill" style="width: ${vol}%"></div>
              <input
                type="range"
                min="0"
                max="100"
                .value="${String(vol)}"
                @input="${(e: Event) => {
                  this._volDrag = Number((e.target as HTMLInputElement).value);
                }}"
                @change="${(e: Event) => {
                  const v = Number((e.target as HTMLInputElement).value);
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

  private _renderTelemetryBadge(stateObj: any) {
    const attrs = stateObj?.attributes;
    if (!attrs) return html``;

    const codec = attrs.audio_codec || attrs.codec || '';
    const sampleRate = attrs.sample_rate ? `${attrs.sample_rate / 1000}kHz` : '';
    const bitDepth = attrs.bit_depth ? `${attrs.bit_depth}-bit` : '';

    if (!codec && !sampleRate) return html``;

    const telemetryString = [codec.toUpperCase(), sampleRate, bitDepth].filter(Boolean).join(' • ');

    return html`
      <div class="telemetry-badge" title="High-Res Stream Telemetry">
        <ha-icon icon="mdi:flash-outline"></ha-icon>
        <span>${telemetryString}</span>
      </div>
    `;
  }

  private _formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  private _mediaCmd(service: string) {
    if (!this.config.entity) return;
    this.hass.callService('media_player', service, { entity_id: this.config.entity });
  }

@state() private _liveTick = 0;
  private _tickInterval?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    this._tickInterval = window.setInterval(() => {
      const entityId = this.config?.entity;
      const stateObj = entityId ? this.hass?.states[entityId] : undefined;
      if (stateObj?.state === 'playing' && this._seekDrag === null) {
        this._liveTick = Date.now();
      }
    }, 1000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = undefined;
    }
  }

  private _setDspProfile(profile: string) {
    if (!this.config.entity) return;
    this.hass.callService('script', 'set_audio_dsp_profile', {
      profile: profile,
      entity_id: this.config.entity,
    });
    this._dspDrawerOpen = false;
  }

  static styles = [
    LuminaThemeStyles,
    css`
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
      .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .telemetry-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 1px 6px;
        border-radius: 6px;
        background: rgba(251, 191, 36, 0.18);
        color: #fbbf24;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        flex-shrink: 0;
      }
      .telemetry-badge ha-icon {
        --mdc-icon-size: 11px;
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
      .t-btn.dsp-btn.active {
        background: var(--aurora-accent-color);
        color: #ffffff;
      }
      .progress-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .progress-rail {
        position: relative;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
        cursor: pointer;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--aurora-accent-color), #f43f5e);
        border-radius: 3px;
        pointer-events: none;
        transition: width 0.1s linear;
      }
      .progress-rail input[type='range'] {
        position: absolute;
        inset: -6px 0;
        width: 100%;
        height: 18px;
        opacity: 0;
        cursor: pointer;
        margin: 0;
      }
      .time-row {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--aurora-text-secondary);
      }
      .dsp-profiles-drawer {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: fadeIn 0.2s ease-out;
      }
      .dsp-title {
        font-size: 11px;
        font-weight: 600;
        color: var(--aurora-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .dsp-pills {
        display: flex;
        gap: 6px;
      }
      .dsp-pill {
        flex: 1;
        padding: 6px 0;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: var(--aurora-text-primary);
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .dsp-pill:hover {
        background: var(--aurora-accent-color);
        border-color: var(--aurora-accent-color);
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
  ];
}