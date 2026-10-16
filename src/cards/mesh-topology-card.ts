import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, handleAction } from '../utils/hass-connect';
import { LuminaThemeStyles } from '../styles/lumina-theme';

interface MeshNodeItem {
  entity_id: string;
  name: string;
  lqi: number;
  protocol: 'Zigbee' | 'Matter';
}

@customElement('aurora-mesh-topology-card')
export class AuroraMeshTopologyCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: AuroraCardConfig;

  protected render() {
    if (!this.config || !this.hass) return html``;

    const nodes = this._collectMeshNodes();
    const avgLqi =
      nodes.length > 0
        ? Math.round(nodes.reduce((acc, n) => acc + n.lqi, 0) / nodes.length)
        : 255;

    const coordState = this.config.coordinator_entity
      ? this.hass.states[this.config.coordinator_entity]?.state
      : 'Online';

    return html`
      <ha-card>
        <div class="mesh-header">
          <div class="mesh-id">
            <div class="mesh-icon">
              <ha-icon .icon="${this.config.icon || 'mdi:hubspot'}"></ha-icon>
            </div>
            <div class="mesh-titles">
              <span class="title">${this.config.name || 'Zigbee2MQTT & Matter Mesh'}</span>
              <span class="subtitle">Coordinator: ${coordState} • Avg LQI ${avgLqi}</span>
            </div>
          </div>

          <span class="node-count-pill">${nodes.length} Nodes</span>
        </div>

        <div class="mesh-list">
          ${nodes.slice(0, 6).map((node) => {
            const pct = Math.min(100, Math.round((node.lqi / 255) * 100));
            const qualityClass = pct > 60 ? 'good' : pct > 30 ? 'fair' : 'weak';

            return html`
              <div
                class="mesh-row"
                @click="${() =>
                  handleAction(this, this.hass, { entity: node.entity_id, tap_action: { action: 'more-info' } }, 'tap')}"
              >
                <span class="proto-tag ${node.protocol.toLowerCase()}">${node.protocol}</span>
                <span class="node-name">${node.name}</span>
                <div class="lqi-bar-wrap">
                  <div class="lqi-bar ${qualityClass}" style="width: ${pct}%"></div>
                </div>
                <span class="lqi-num">${node.lqi}</span>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  private _collectMeshNodes(): MeshNodeItem[] {
    const list: MeshNodeItem[] = [];
    for (const [id, stateObj] of Object.entries(this.hass.states) as [string, any][]) {
      if (id.endsWith('_linkquality') || stateObj.attributes.linkquality !== undefined) {
        const lqi = Number(
          stateObj.attributes.linkquality !== undefined
            ? stateObj.attributes.linkquality
            : stateObj.state
        );
        if (!isNaN(lqi)) {
          list.push({
            entity_id: id,
            name: (stateObj.attributes.friendly_name || id).replace(/ linkquality$/i, ''),
            lqi,
            protocol: 'Zigbee',
          });
        }
      } else if (id.includes('matter') || id.includes('thread')) {
        list.push({
          entity_id: id,
          name: stateObj.attributes.friendly_name || id,
          lqi: stateObj.state === 'unavailable' ? 0 : 220,
          protocol: 'Matter',
        });
      }
    }
    return list.sort((a, b) => a.lqi - b.lqi);
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
        gap: 12px;
      }
      .mesh-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mesh-id {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mesh-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: var(--aurora-accent-glow);
        color: var(--aurora-accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mesh-titles {
        display: flex;
        flex-direction: column;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 12px;
        color: var(--aurora-text-secondary);
      }
      .node-count-pill {
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--aurora-surface-subtle);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 11px;
        font-weight: 600;
      }
      .mesh-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .mesh-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 10px;
        border-radius: 10px;
        background: var(--aurora-surface-subtle);
        cursor: pointer;
        font-size: 12px;
      }
      .proto-tag {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 6px;
        text-transform: uppercase;
      }
      .proto-tag.zigbee {
        background: rgba(251, 191, 36, 0.18);
        color: var(--aurora-warning-color);
      }
      .proto-tag.matter {
        background: rgba(56, 189, 248, 0.18);
        color: #38bdf8;
      }
      .node-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .lqi-bar-wrap {
        width: 64px;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .lqi-bar.good {
        height: 100%;
        background: var(--aurora-success-color);
      }
      .lqi-bar.fair {
        height: 100%;
        background: var(--aurora-warning-color);
      }
      .lqi-bar.weak {
        height: 100%;
        background: var(--aurora-danger-color);
      }
      .lqi-num {
        min-width: 28px;
        text-align: right;
        font-weight: 600;
        color: var(--aurora-text-secondary);
      }
    `,
  ];
}