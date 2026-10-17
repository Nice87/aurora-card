import { HomeAssistant } from 'custom-card-helpers';

export interface AuroraActionConfig {
  action: 'toggle' | 'more-info' | 'navigate' | 'call-service' | 'none';
  navigation_path?: string;
  service?: string;
  service_data?: Record<string, any>;
}

export interface AuroraSubButtonConfig {
  entity?: string;
  name?: string;
  icon?: string;
  show_state?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_background?: boolean;
  sub_button_type?: 'default' | 'slider' | 'select';
  tap_action?: AuroraActionConfig;
}

export interface AuroraFloorplanHotspot {
  id: string;
  name?: string;
  entity?: string;
  hash?: string;
  x: number;
  y: number;
  icon?: string;
}

export interface AuroraMacroStep {
  service: string;
  entity_id?: string;
  target?: { entity_id?: string | string[] };
  data?: Record<string, any>;
  delay?: number;
  delay_ms?: number;
}

export interface AuroraCardConfig {
  type?: string;
  card_type?: string;
  button_type?: 'switch' | 'slider' | 'state' | 'name';
  entity?: string;
  name?: string;
  icon?: string;
  hash?: string;
  backdrop_blur?: string;
  scrolling_effect?: boolean;
  show_icon?: boolean;
  prioritise_icon?: boolean;
  show_name?: boolean;
  state_content?: string[];
  tap_action?: AuroraActionConfig;
  icon_tap_action?: AuroraActionConfig;
  hold_action?: AuroraActionConfig;
  sub_button?: AuroraSubButtonConfig[];
  vibe_preset?: 'aurora_lumina' | 'crimson_midnight' | 'obsidian_minimal' | 'ha_native';
  custom_styles?: string;
  enable_unsupported_modules?: boolean;
  active_modules?: string[];
  global_modules?: string[];
  module_configs?: Record<string, Record<string, any>>;
  [key: string]: any;
}

export interface ExtendedAuroraConfig extends AuroraCardConfig {
  type?: string;
  card_type?: string;
  button_type?: 'switch' | 'slider' | 'state' | 'name';
  entity?: string;
  name?: string;
  icon?: string;
  hash?: string;
  backdrop_blur?: string;
  scrolling_effect?: boolean;
  show_icon?: boolean;
  prioritise_icon?: boolean;
  show_name?: boolean;
  state_content?: string[];
  icon_tap_action?: AuroraActionConfig;
  hold_action?: AuroraActionConfig;
  card_layout?: string;
  vibe_preset?: 'aurora_lumina' | 'crimson_midnight' | 'obsidian_minimal' | 'ha_native';
  custom_styles?: string;
  enable_unsupported_modules?: boolean;
  active_modules?: string[];
  global_modules?: string[];
  module_configs?: Record<string, Record<string, any>>;
  [key: string]: any;
}

export const fireEvent = (
  node: HTMLElement | Window,
  type: string,
  detail?: Record<string, any>,
  options?: { bubbles?: boolean; cancelable?: boolean; composed?: boolean }
): CustomEvent => {
  const opts = options ?? {};
  const event = new CustomEvent(type, {
    bubbles: opts.bubbles === undefined ? true : opts.bubbles,
    cancelable: Boolean(opts.cancelable),
    composed: opts.composed === undefined ? true : opts.composed,
    detail: detail ?? {},
  });
  node.dispatchEvent(event);
  return event;
};

export const executeAuroraAction = (
  node: HTMLElement | Window,
  hass: HomeAssistant,
  config: AuroraCardConfig,
  actionConfig?: AuroraActionConfig | string,
  overrideEntityId?: string
): void => {
  if (!hass) return;
  const targetEntity = overrideEntityId ?? config.entity ?? '';
  
  const resolvedAction: AuroraActionConfig =
    typeof actionConfig === 'string'
      ? { action: 'toggle' }
      : actionConfig ?? config.tap_action ?? { action: 'toggle' };

  const act = resolvedAction.action ?? 'toggle';

  if (act === 'none') return;

  if (act === 'more-info') {
    if (targetEntity && node instanceof HTMLElement) {
      fireEvent(node, 'hass-more-info', { entityId: targetEntity });
    }
    return;
  }

  if (act === 'navigate') {
    const path = resolvedAction.navigation_path ?? config.hash ?? '#aurora-popup';
    if (path.startsWith('#')) {
      window.location.hash = path;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.history.pushState(null, '', path);
      if (window instanceof Window) {
        fireEvent(window, 'location-changed', { replace: false });
      }
    }
    return;
  }

  if (act === 'call-service' && resolvedAction.service) {
    const [domain, service] = resolvedAction.service.split('.');
    if (domain && service) {
      hass.callService(domain, service, resolvedAction.service_data ?? { entity_id: targetEntity });
    }
    return;
  }

  if (targetEntity) {
    const domain = targetEntity.split('.')[0];
    if (domain === 'scene' || domain === 'script') {
      hass.callService(domain, 'turn_on', { entity_id: targetEntity });
    } else {
      hass.callService('homeassistant', 'toggle', { entity_id: targetEntity });
    }
  }
};

/**
 * Compatibility alias for legacy cards using `handleAction`
 */
export const handleAction = (
  node: HTMLElement | Window,
  hass: HomeAssistant,
  config: AuroraCardConfig,
  actionConfig?: AuroraActionConfig | string,
  overrideEntityId?: string
): void => {
  executeAuroraAction(node, hass, config, actionConfig, overrideEntityId);
};