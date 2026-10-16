import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCondition } from './visibility';

export type AuroraCardType =
  | 'button'
  | 'pop-up'
  | 'separator'
  | 'cover'
  | 'climate'
  | 'media-player'
  | 'empty-column'
  | 'routine-macro'
  | 'energy-flow'
  | 'security-matrix'
  | 'weather-radar'
  | 'multi-room-audio'
  | 'hvac-zoning'
  | 'mesh-topology'
  | 'ev-charger'
  | 'air-quality'
  | 'floorplan';

export interface AuroraActionConfig {
  action: 'more-info' | 'toggle' | 'navigate' | 'call-service' | 'none';
  navigation_path?: string;
  service?: string;
  service_data?: Record<string, any>;
}

export interface AuroraSubButtonConfig {
  entity?: string;
  name?: string;
  icon?: string;
  show_state?: boolean;
  show_background?: boolean;
  tap_action?: AuroraActionConfig;
}

export interface AuroraMacroStep {
  service: string;
  entity_id?: string;
  data?: Record<string, any>;
  delay_ms?: number;
}

export interface AuroraFloorplanHotspot {
  entity: string;
  name?: string;
  icon?: string;
  x: number;
  y: number;
  hash?: string;
}

export interface AuroraCardConfig {
  type: string;
  card_type?: AuroraCardType;
  entity?: string;
  name?: string;
  icon?: string;
  button_type?: 'switch' | 'slider' | 'state' | 'name';
  show_state?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  sub_button?: AuroraSubButtonConfig[];
  // Pop-up properties
  hash?: string;
  auto_close?: number;
  close_on_click?: boolean;
  backdrop_blur?: number;
  cards?: Array<Record<string, any>>;
  // Climate & Cover properties
  step?: number;
  min_temp?: number;
  max_temp?: number;
  // Batch 3: Routine Macro
  macro_steps?: AuroraMacroStep[];
  // Batch 3: Energy Flow
  solar_entity?: string;
  grid_entity?: string;
  battery_entity?: string;
  home_entity?: string;
  tariff_entity?: string;
  // Batch 3: Security Matrix
  alarm_entity?: string;
  cameras?: string[];
  perimeter_entities?: string[];
  doorbell_chime_entity?: string;
  doorbell_motion_entity?: string;
  // Batch 3: Weather & Microclimate
  dew_point_entity?: string;
  vpd_entity?: string;
  discomfort_entity?: string;
  // Batch 3: Multi-Room Audio
  speaker_entities?: string[];
  // Batch 4: HVAC & Storage Heating Zoning
  zone_entities?: string[];
  charging_window?: string;
  // Batch 4: Zigbee / Matter Mesh Topology
  coordinator_entity?: string;
  mesh_filter?: string;
  // Batch 4: EV / E-Bike & Solar Charger
  power_entity?: string;
  current_limit_entity?: string;
  charger_switch_entity?: string;
  // Batch 4: Air Quality & Acoustic Density Matrix
  co2_entity?: string;
  pm25_entity?: string;
  voc_entity?: string;
  humidity_entity?: string;
  air_density_entity?: string;
  // Batch 4: Interactive Floorplan
  image_url?: string;
  hotspots?: AuroraFloorplanHotspot[];
  // Universal
  visibility?: AuroraCondition[];
  tap_action?: AuroraActionConfig;
  hold_action?: AuroraActionConfig;
}

export function fireEvent(
  node: HTMLElement | Window,
  type: string,
  detail: Record<string, any> = {},
  options: { bubbles?: boolean; composed?: boolean } = {}
) {
  const event = new CustomEvent(type, {
    bubbles: options.bubbles ?? true,
    composed: options.composed ?? true,
    detail,
  });
  node.dispatchEvent(event);
  return event;
}

export function handleAction(
  node: HTMLElement,
  hass: HomeAssistant,
  config: { entity?: string; tap_action?: AuroraActionConfig; hold_action?: AuroraActionConfig },
  actionType: 'tap' | 'hold'
) {
  const action = actionType === 'tap' ? config.tap_action : config.hold_action;
  const actionName = action?.action || (actionType === 'tap' ? 'toggle' : 'more-info');

  switch (actionName) {
    case 'toggle':
      if (config.entity) {
        hass.callService('homeassistant', 'toggle', { entity_id: config.entity });
      }
      break;
    case 'navigate':
      if (action?.navigation_path) {
        if (action.navigation_path.startsWith('#')) {
          window.location.hash = action.navigation_path;
          fireEvent(window, 'location-changed', {});
        } else {
          history.pushState(null, '', action.navigation_path);
          fireEvent(window, 'location-changed', {});
        }
      }
      break;
    case 'call-service':
      if (action?.service) {
        const [domain, service] = action.service.split('.');
        const serviceData = { ...(action.service_data || {}) };
        if (config.entity && !serviceData.entity_id) {
          serviceData.entity_id = config.entity;
        }
        hass.callService(domain, service, serviceData);
      }
      break;
    case 'more-info':
      if (config.entity) {
        fireEvent(node, 'hass-more-info', { entityId: config.entity });
      }
      break;
    case 'none':
    default:
      break;
  }
}