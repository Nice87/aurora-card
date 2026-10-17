import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

@customElement('aurora-multi-room-audio-card')
export class AuroraMultiRoomAudioCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const masterId = this.config.entity;
    const masterState = masterId ? this.hass.states[masterId] : undefined;
    const isPlaying = masterState?.state === 'playing';
    const trackTitle =
      masterState?.attributes.media_title ||
      this.config.name ||
      masterState?.attributes.friendly_name ||
      'Music Assistant Matrix';
    const trackArtist = masterState?.attributes.media_artist || masterState?.state || 'Idle';

    const speakers =
      this.config.speaker_entities && this.config.speaker_entities.length > 0
        ? this.config.speaker_entities
        : masterId
        ? [masterId]
        : [];

    const groupMembers: string[] = masterState?.attributes.group_members || [];

    return html`
      <ha-card>
        <div class="ma-header">
          <div class="ma-icon ${isPlaying ? 'active' : ''}">
            <ha-icon .icon="${this.config.icon || 'mdi:speaker-multiple'}"></ha-icon>
          </div>
          <div class="ma-meta">
            <span class="title">${trackTitle}</span>
            <span class="subtitle">${trackArtist}</span>
          </div>
          <button
            class="play-toggle"
            @click="${() =>
              masterId &&
              this.hass.callService('media_player', 'media_play_pause', { entity_id: masterId })}"
          >
            <ha-icon .icon="${isPlaying ? 'mdi:pause' : 'mdi:play'}"></ha-icon>
          </button>
        </div>

        <div class="zones-list">
          ${speakers.map((spkId: string) => {
            const spkObj = this.hass.states[spkId];
            if (!spkObj) return html``;
            const vol = Math.round((spkObj.attributes.volume_level ?? 0.4) * 100);
            const isJoined = groupMembers.includes(spkId) || spkId === masterId;

            return html`
              <div class="zone-row">
                <button
                  class="join-btn ${isJoined ? 'joined' : ''}"
                  @click="${() => this._toggleSpeakerJoin(spkId, isJoined)}"
                  title="Join / Unjoin Zone"
                >
                  <ha-icon .icon="${isJoined ? 'mdi:checkbox-marked-circle' : 'mdi:checkbox-blank-circle-outline'}"></ha-icon>
                </button>
                <span class="zone-name">${spkObj.attributes.friendly_name || spkId}</span>
                <input
                  type="range"
                  class="zone-slider"
                  min="0"
                  max="100"
                  .value="${String(vol)}"
                  @change="${(e: Event) => {
                    const v = Number((e.target as HTMLInputElement).value);
                    this.hass.callService('media_player', 'volume_set', {
                      entity_id: spkId,
                      volume_level: v / 100,
                    });
                  }}"
                />
                <span class="zone-vol">${vol}%</span>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  private _toggleSpeakerJoin(speakerId: string, currentlyJoined: boolean) {
    const masterId = this.config.entity;
    if (!masterId || speakerId === masterId) return;

    if (currentlyJoined) {
      this.hass.callService('media_player', 'unjoin', { entity_id: speakerId });
    } else {
      this.hass.callService('media_player', 'join', {
        entity_id: masterId,
        group_members: [speakerId],
      });
    }
  }

  static styles = [
    LuminaThemeStyles,
    css`
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
      .ma-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ma-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--aurora-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ma-icon.active {
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
      }
      .ma-meta {
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
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
        text-transform: capitalize;
      }
      .play-toggle {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background: var(--aurora-accent-color);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .zones-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .zone-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .join-btn {
        background: transparent;
        border: none;
        color: var(--aurora-text-secondary);
        cursor: pointer;
        padding: 0;
        display: flex;
      }
      .join-btn.joined {
        color: var(--aurora-accent-color);
      }
      .zone-name {
        font-size: 12px;
        font-weight: 500;
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .zone-slider {
        flex: 1;
        accent-color: var(--aurora-accent-color);
        cursor: ew-resize;
      }
      .zone-vol {
        font-size: 11px;
        color: var(--aurora-text-secondary);
        min-width: 30px;
        text-align: right;
      }
    `,
  ];
}