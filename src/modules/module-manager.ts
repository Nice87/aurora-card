import { html, TemplateResult } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';
import { AuroraCardConfig, executeAuroraAction, fireEvent } from '../utils/hass-connect';
import { AuroraModuleDefinition } from '../editor/editor-base';

const GLOBAL_MODULES_STORAGE_KEY = 'aurora_global_modules_state_v1';
const CUSTOM_MODULES_STORAGE_KEY = 'aurora_custom_modules_v1';

interface GlobalModulesPayload {
  globalModules: string[];
  moduleConfigs: Record<string, Record<string, any>>;
}

export class AuroraModuleManager {
  /**
   * Synchronizes "All cards" (global_modules) and their settings across the dashboard
   */
  public static syncGlobalConfigFromCard(config: AuroraCardConfig): void {
    try {
      if (Array.isArray(config.global_modules)) {
        const existing = this.getGlobalPayload();
        const mergedConfigs = {
          ...existing.moduleConfigs,
          ...(config.module_configs ?? {}),
        };
        const payload: GlobalModulesPayload = {
          globalModules: config.global_modules,
          moduleConfigs: mergedConfigs,
        };
        localStorage.setItem(GLOBAL_MODULES_STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (_e) {
      // Ignore storage restrictions
    }
  }

  public static getGlobalPayload(): GlobalModulesPayload {
    try {
      const raw = localStorage.getItem(GLOBAL_MODULES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GlobalModulesPayload;
        return {
          globalModules: Array.isArray(parsed.globalModules) ? parsed.globalModules : [],
          moduleConfigs: parsed.moduleConfigs ?? {},
        };
      }
    } catch (_e) {
      // Ignore
    }
    return { globalModules: [], moduleConfigs: {} };
  }

  public static getCustomModules(): AuroraModuleDefinition[] {
    try {
      const raw = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_e) {
      // Ignore
    }
    return [];
  }

  /**
   * Returns a deduplicated list of active module IDs for a given card
   */
  public static getActiveModuleIds(config: AuroraCardConfig): string[] {
    this.syncGlobalConfigFromCard(config);
    const localMods = config.active_modules ?? [];
    const cardGlobalMods = config.global_modules ?? [];
    const storedGlobalMods = this.getGlobalPayload().globalModules;

    const combined = new Set<string>([
      ...localMods,
      ...cardGlobalMods,
      ...storedGlobalMods,
    ]);
    return Array.from(combined);
  }

  /**
   * Retrieves merged configuration for a specific module ID
   */
  public static getModuleConfig(
    config: AuroraCardConfig,
    moduleId: string
  ): Record<string, any> {
    const globalCfg = this.getGlobalPayload().moduleConfigs[moduleId] ?? {};
    const localCfg = config.module_configs?.[moduleId] ?? {};
    return {
      ...globalCfg,
      ...localCfg,
    };
  }

  /**
   * Evaluates ${state}, ${entity}, ${module.xyz} and inline JS template strings safely
   */
  public static evaluateTemplateString(
    template: string,
    hass: HomeAssistant | undefined,
    config: AuroraCardConfig,
    moduleCfg: Record<string, any>
  ): string {
    if (!template) return '';
    const entityId = config.entity ?? '';
    const stateObj = entityId && hass?.states ? hass.states[entityId] : undefined;
    const rawState = stateObj ? stateObj.state : 'unknown';
    const numState = Number.isNaN(Number(rawState)) ? rawState : Number(rawState);

    return template.replace(/\$\{([^}]+)\}/g, (_match, expr: string) => {
      const trimmed = expr.trim();
      if (trimmed === 'state') return String(rawState);
      if (trimmed === 'entity') return entityId;
      if (trimmed.startsWith('module.')) {
        const key = trimmed.slice(7);
        const val = moduleCfg[key];
        return val !== undefined ? String(val) : '';
      }
      try {
        const fn = new Function(
          'hass',
          'entity',
          'state',
          'stateObj',
          'module',
          'return (' + trimmed + ');'
        );
        const result = fn(hass, entityId, numState, stateObj, moduleCfg);
        return result !== undefined && result !== null ? String(result) : '';
      } catch (_err) {
        return '';
      }
    });
  }

  /**
   * Checks whether default card content should be hidden (e.g. Multi Section Card)
   */
  public static shouldHideDefaultContent(config: AuroraCardConfig): boolean {
    const activeIds = this.getActiveModuleIds(config);
    if (!activeIds.includes('multi_section_card')) return false;
    const modCfg = this.getModuleConfig(config, 'multi_section_card');
    return modCfg.hide_default_content !== false;
  }

  /**
   * Generates dynamic <style> rules for Vibe Presets, Active Modules, and Custom Styles
   */
  public static generateDynamicStyles(
    hass: HomeAssistant | undefined,
    config: AuroraCardConfig
  ): string {
    const cssChunks: string[] = [];
    const activeIds = this.getActiveModuleIds(config);

    // 1. Aesthetic Vibe Presets
    const preset = config.vibe_preset ?? 'aurora_lumina';
    if (preset === 'crimson_midnight') {
      cssChunks.push(`
        .aurora-card-surface {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(136, 19, 55, 0.45)) !important;
          border: 1px solid rgba(212, 175, 55, 0.38) !important;
          box-shadow: 0 8px 28px rgba(136, 19, 55, 0.28) !important;
        }
      `);
    } else if (preset === 'obsidian_minimal') {
      cssChunks.push(`
        .aurora-card-surface {
          background: #111315 !important;
          border: 1px solid rgba(255, 255, 255, 0.07) !important;
          backdrop-filter: none !important;
        }
      `);
    } else if (preset === 'ha_native') {
      cssChunks.push(`
        .aurora-card-surface {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c)) !important;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12)) !important;
          backdrop-filter: none !important;
        }
      `);
    }

    // 2. Built-in Module: Bubble Chips
    if (activeIds.includes('bubble_chips')) {
      const chipCfg = this.getModuleConfig(config, 'bubble_chips');
      const heightPx = Number(chipCfg.chip_height ?? 42);
      cssChunks.push(`
        .aurora-card-surface {
          border-radius: 999px !important;
          min-height: ${heightPx}px !important;
          padding: 6px 14px !important;
        }
      `);
    }

    // 3. Built-in Module: Accent Color Picker
    if (activeIds.includes('accent_color_picker')) {
      const accCfg = this.getModuleConfig(config, 'accent_color_picker');
      const color = String(accCfg.accent_color ?? accCfg.custom_param ?? '#e11d48');
      cssChunks.push(`
        :host {
          --aurora-accent: ${color} !important;
        }
        .aurora-card-surface[data-state-on] {
          border-color: ${color} !important;
          box-shadow: 0 0 20px ${color}40 !important;
        }
        .aurora-card-surface[data-state-on] .aurora-main-icon-wrap {
          background: ${color}33 !important;
          color: ${color} !important;
        }
      `);
    }

    // 4. Built-in Module: Multi Section Card background override
    if (activeIds.includes('multi_section_card')) {
      const msCfg = this.getModuleConfig(config, 'multi_section_card');
      if (msCfg.bg_color) {
        const rawColor = String(msCfg.bg_color).trim();
        const resolvedColor =
          rawColor === 'accent'
            ? 'var(--accent-color)'
            : rawColor === 'primary'
            ? 'var(--primary-color)'
            : rawColor;
        cssChunks.push(`
          .aurora-card-surface {
            background: ${resolvedColor} !important;
          }
        `);
      }
    }

    // 5. Built-in Module: Conditional Slider Button Coloring
    if (activeIds.includes('conditional_slider_coloring')) {
      const condCfg = this.getModuleConfig(config, 'conditional_slider_coloring');
      const defaultCol = String(condCfg.default_color ?? 'var(--primary-color, #38bdf8)');
      const ruleStr = String(condCfg.condition_rule ?? '').trim();
      let activeSliderColor = defaultCol;

      const entityId = config.entity ?? '';
      const stateObj = entityId && hass?.states ? hass.states[entityId] : undefined;
      const numericVal = stateObj ? parseFloat(stateObj.state) : NaN;

      if (ruleStr && !Number.isNaN(numericVal)) {
        // Parse rules like "#ef4444 when > 22"
        const match = ruleStr.match(/^([^\s]+)\s+when\s*([><=]+)\s*(-?\d+(?:\.\d+)?)/i);
        if (match) {
          const targetColor = match[1];
          const op = match[2];
          const threshold = parseFloat(match[3]);
          if (op === '>' && numericVal > threshold) activeSliderColor = targetColor;
          if (op === '>=' && numericVal >= threshold) activeSliderColor = targetColor;
          if (op === '<' && numericVal < threshold) activeSliderColor = targetColor;
          if (op === '<=' && numericVal <= threshold) activeSliderColor = targetColor;
          if (op === '==' && numericVal === threshold) activeSliderColor = targetColor;
        }
      }

      cssChunks.push(`
        .aurora-slider-fill {
          background: ${activeSliderColor} !important;
        }
      `);
    }

    // 6. Custom User-Created Modules from Module Studio
    const customMods = this.getCustomModules();
    for (const customMod of customMods) {
      if (activeIds.includes(customMod.id) && customMod.codeTemplate) {
        const modCfg = this.getModuleConfig(config, customMod.id);
        const evaluatedCss = this.evaluateTemplateString(
          customMod.codeTemplate,
          hass,
          config,
          modCfg
        );
        cssChunks.push(evaluatedCss);
      }
    }

    // 7. Card-Level Custom Styles & Templates
    if (config.custom_styles) {
      const evaluatedCustom = this.evaluateTemplateString(
        config.custom_styles,
        hass,
        config,
        {}
      );
      cssChunks.push(evaluatedCustom);
    }

    return cssChunks.join('\n');
  }

  /**
   * Renders the Card Backdrop Image layer if enabled
   */
  public static renderBackdropLayer(config: AuroraCardConfig): TemplateResult {
    const activeIds = this.getActiveModuleIds(config);
    if (!activeIds.includes('card_backdrop_image')) return html``;

    const cfg = this.getModuleConfig(config, 'card_backdrop_image');
    const imageUrl = String(cfg.image_url ?? '');
    if (!imageUrl) return html``;

    const size = String(cfg.size ?? 'cover');
    const repeat = String(cfg.repeat ?? 'no-repeat');
    const customPos = Boolean(cfg.custom_position);
    const posX = Number(cfg.pos_x ?? 50);
    const posY = Number(cfg.pos_y ?? 50);
    const opacity = Number(cfg.image_opacity ?? 100) / 100;
    const blur = Number(cfg.blur ?? 0);
    const scale = Number(cfg.scale ?? 100) / 100;
    const overlayColor = String(cfg.overlay_color ?? '#000000');

    const bgPosition = customPos ? `${posX}\%${posY}%` : 'center center';
    const layerStyle = [
      `background-image: url('${imageUrl}')`,
      `background-size: ${size}`,
      `background-repeat: ${repeat}`,
      `background-position: ${bgPosition}`,
      `opacity: ${opacity}`,
      `filter: blur(${blur}px)`,
      `transform: scale(${scale})`,
    ].join('; ');

    return html`
      <div class="aurora-backdrop-container">
        <div class="aurora-backdrop-image" style="${layerStyle}"></div>
        <div
          class="aurora-backdrop-overlay"
          style="background-color: ${overlayColor}; opacity: 0.32;"
        ></div>
      </div>
    `;
  }

  /**
   * Renders the SVG Circular Progress Ring around the main icon if Icon Border Progress is enabled
   */
  public static renderIconProgressRing(
    hass: HomeAssistant | undefined,
    config: AuroraCardConfig
  ): TemplateResult {
    const activeIds = this.getActiveModuleIds(config);
    if (!activeIds.includes('icon_border_progress')) return html``;

    const cfg = this.getModuleConfig(config, 'icon_border_progress');
    const targetEnt = String(cfg.progress_entity ?? config.entity ?? '');
    const stateObj = targetEnt && hass?.states ? hass.states[targetEnt] : undefined;

    let pct = 65;
    if (stateObj) {
      const rawNum = parseFloat(stateObj.state);
      if (!Number.isNaN(rawNum)) {
        pct = Math.max(0, Math.min(100, rawNum));
      } else if (stateObj.attributes.brightness !== undefined) {
        pct = Math.round((Number(stateObj.attributes.brightness) / 255) * 100);
      } else if (stateObj.attributes.battery_level !== undefined) {
        pct = Number(stateObj.attributes.battery_level);
      } else if (stateObj.state === 'on' || stateObj.state === 'heat') {
        pct = 100;
      } else {
        pct = 0;
      }
    }

    const radius = 19;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return html`
      <svg class="aurora-icon-progress-svg" viewBox="0 0 44 44">
        <circle
          class="ring-track"
          cx="22"
          cy="22"
          r="${radius}"
          fill="none"
          stroke-width="2.5"
        ></circle>
        <circle
          class="ring-fill"
          cx="22"
          cy="22"
          r="${radius}"
          fill="none"
          stroke-width="2.5"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
        ></circle>
      </svg>
    `;
  }

  /**
   * Renders the 2, 3, or 4 column Multi Section Card extension
   */
  public static renderMultiSectionExtension(
    hostNode: HTMLElement,
    hass: HomeAssistant | undefined,
    config: AuroraCardConfig,
    getIconFn: (ent: string, customIcon?: string) => string,
    getNameFn: (ent: string, customName?: string) => string,
    getStateFn: (ent: string) => string
  ): TemplateResult {
    const activeIds = this.getActiveModuleIds(config);
    if (!activeIds.includes('multi_section_card')) return html``;

    const cfg = this.getModuleConfig(config, 'multi_section_card');
    const count = Math.min(4, Math.max(2, Number(cfg.section_count ?? 3)));
    const indices = Array.from({ length: count }, (_, i) => i + 1);

    return html`
      <div
        class="aurora-multi-section-grid"
        style="grid-template-columns: repeat(${count}, minmax(0, 1fr));"
      >
        ${indices.map((num) => {
          const ent = String(cfg['entity_' + num] ?? config.entity ?? '');
          const customIcon = String(cfg['icon_' + num] ?? '');
          const customName = String(cfg['name_' + num] ?? '');
          const icon = getIconFn(ent, customIcon);
          const label = getNameFn(ent, customName);
          const stateStr = getStateFn(ent);

          return html`
            <div
              class="aurora-multi-sec-cell"
              @click="${(e: Event) => {
                e.stopPropagation();
                if (ent && hass) {
                  fireEvent(hostNode, 'hass-more-info', { entityId: ent });
                }
              }}"
            >
              <div class="sec-cell-icon">
                <ha-icon .icon="${icon}"></ha-icon>
              </div>
              <div class="sec-cell-text">
                <span class="sec-cell-name">${label}</span>
                <span class="sec-cell-state">${stateStr}</span>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}