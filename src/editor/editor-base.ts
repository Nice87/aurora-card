import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { AuroraCardConfig, AuroraSubButtonConfig, ExtendedAuroraConfig, fireEvent } from '../utils/hass-connect';
import { AuroraModuleDefinition } from '../modules/module.interface';
import { moduleRegistry } from '../modules/registry';

type PickerTarget =
  | { type: 'main' }
  | { type: 'sub'; index: number }
  | { type: 'icon_main' }
  | { type: 'icon_sub'; index: number }
  | { type: 'module_field'; moduleId: string; fieldKey: string };

const AVAILABLE_STATE_ATTRIBUTES = [
  { id: 'state', label: 'State' },
  { id: 'preset_mode', label: 'Preset Mode' },
  { id: 'hvac_action', label: 'HVAC Action' },
  { id: 'brightness', label: 'Brightness' },
  { id: 'battery_level', label: 'Battery Level' },
  { id: 'temperature', label: 'Temperature' },
  { id: 'humidity', label: 'Humidity' },
  { id: 'last_changed', label: 'Last Changed' },
];

const SUPPORTED_CARD_TYPES: Array<{ id: string; label: string }> = [
  { id: 'button', label: 'Button' },
  { id: 'climate', label: 'Thermostat' },
  { id: 'cover', label: 'Cover' },
  { id: 'media-player', label: 'Media player' },
  { id: 'pop-up', label: 'Pop-up' },
  { id: 'separator', label: 'Separator' },
  { id: 'sub-buttons', label: 'Sub-buttons' },
];

const POPULAR_ICONS = [
  'mdi:home', 'mdi:lightbulb', 'mdi:power', 'mdi:fan', 'mdi:television', 'mdi:speaker',
  'mdi:sofa', 'mdi:bed', 'mdi:door', 'mdi:window-open', 'mdi:thermometer', 'mdi:water',
  'mdi:fire', 'mdi:security', 'mdi:lock', 'mdi:camera', 'mdi:robot-vacuum', 'mdi:car',
  'mdi:garage', 'mdi:weather-sunny', 'mdi:weather-night', 'mdi:weather-partly-cloudy',
  'mdi:weather-pouring', 'mdi:snowflake', 'mdi:palette', 'mdi:brightness-6', 'mdi:flash',
  'mdi:battery', 'mdi:wifi', 'mdi:router-wireless', 'mdi:cast', 'mdi:air-conditioner',
  'mdi:ceiling-fan', 'mdi:washing-machine', 'mdi:silverware-fork-knife', 'mdi:desk',
  'mdi:desktop-pc', 'mdi:laptop', 'mdi:flower', 'mdi:leaf'
];



@customElement('aurora-card-editor')
export class AuroraCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: ExtendedAuroraConfig;
  @state() private _activeCategory: 'all' | 'general' | 'subbuttons' | 'styles' | 'modules' = 'all';
  @state() private _moduleSubTab: 'my_modules' | 'store' = 'my_modules';

  @state() private _pickerOpen = false;
  @state() private _iconPickerOpen = false;
  @state() private _pickerTarget: PickerTarget = { type: 'main' };
  @state() private _pickerSearchQuery = '';
  @state() private _pickerDomainFilter = 'all';
  @state() private _statePickerOpen = false;
  @state() private _customAttributeInput: string = '';

  @state() private _expandedModules: Record<string, boolean> = {};
  @state() private _expandedSubButtons: Record<number, boolean> = {};
  @state() private _statusToast = '';

  @state() private _creatorOpen = false;
  @state() private _importYamlOpen = false;
  @state() private _importYamlText = '';
  @state() private _creatorDraft: AuroraModuleDefinition = {
    id: 'custom_module',
    name: 'Custom Module',
    version: '1.0',
    creator: 'Przemysław',
    description: '',
    type: 'base-extension',
    supportedCards: ['button'],
    codeTemplate: '.aurora-card {\n  \n}',
    editorSchemaYaml: '',
    yamlExample: '',
  };

  @state() private _openHubs: Record<string, boolean> = {
    identity: true,
    settings: true,
    states: true,
    actions: false,
    subbuttons: false,
    styling: false,
    modules: true,
  };

  public setConfig(config: AuroraCardConfig): void {
    this._config = {
      card_type: 'button',
      button_type: 'switch',
      scrolling_effect: true,
      show_icon: true,
      prioritise_icon: false,
      show_name: true,
      state_content: ['state'],
      active_modules: [],
      module_configs: {},
      ...config,
    };
  }

  private _showToast(msg: string): void {
    this._statusToast = msg;
    setTimeout(() => {
      this._statusToast = '';
    }, 2800);
  }

  private _toggleHub(key: string): void {
    this._openHubs = { ...this._openHubs, [key]: !this._openHubs[key] };
  }

  private _toggleModuleSettings(modId: string): void {
    this._expandedModules = {
      ...this._expandedModules,
      [modId]: !this._expandedModules[modId]
    };
  }

  private _toggleSubButtonSettings(index: number): void {
    this._expandedSubButtons = {
      ...this._expandedSubButtons,
      [index]: !this._expandedSubButtons[index]
    };
  }

  private _editUserModule(mod: AuroraModuleDefinition): void {
    this._creatorDraft = { ...mod };
    this._creatorOpen = true;
  }

  private _getModuleConfigString(modId: string): string {
    if (!this._config || !this._config.module_configs) return '';
    const configObj = this._config.module_configs[modId];
    if (!configObj) return '';
    return Object.entries(configObj)
      .map(([k, v]) => `${k}:${v}`)
      .join('\n');
  }

  private _setModuleConfigString(modId: string, val: string): void {
    if (!this._config) return;
    const newConfig: Record<string, any> = {};
    val.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const k = parts[0].trim();
        let v: any = parts.slice(1).join(':').trim();
        if (v === 'true') v = true;
        else if (v === 'false') v = false;
        else if (!isNaN(Number(v)) && v !== '') v = Number(v);
        else if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        if (k) newConfig[k] = v;
      }
    });

    const currentConfigs = this._config.module_configs || {};
    this._setDirectValue('module_configs', {
      ...currentConfigs,
      [modId]: newConfig
    });
  }

  private _openEntityPicker(target: PickerTarget): void {
    this._pickerTarget = target;
    this._pickerSearchQuery = '';
    this._pickerDomainFilter = 'all';
    this._pickerOpen = true;
  }

  private _openIconPicker(target: PickerTarget): void {
    this._pickerTarget = target;
    this._pickerSearchQuery = '';
    this._iconPickerOpen = true;
  }

  private _closeEntityPicker(): void {
    this._pickerOpen = false;
  }

  private _closeIconPicker(): void {
    this._iconPickerOpen = false;
  }

  private _selectEntityFromModal(entityId: string): void {
    if (!this._config) return;
    if (this._pickerTarget.type === 'main') {
      this._setDirectValue('entity', entityId);
    } else if (this._pickerTarget.type === 'sub') {
      this._updateSubButton(this._pickerTarget.index, 'entity', entityId);
    }
    this._pickerOpen = false;
  }

  private _selectIconFromModal(iconString: string): void {
    if (!this._config) return;
    if (this._pickerTarget.type === 'icon_main') {
      this._setDirectValue('icon', iconString);
    } else if (this._pickerTarget.type === 'icon_sub') {
      this._updateSubButton(this._pickerTarget.index, 'icon', iconString);
    }
    this._iconPickerOpen = false;
  }

  private _getEntityFriendlyName(entityId: string): string {
    if (!entityId) return 'Select an entity';
    if (!this.hass || !this.hass.states[entityId]) return entityId;
    const friendly = this.hass.states[entityId].attributes.friendly_name;
    return friendly ? String(friendly) : entityId;
  }

  private _getEntitySecondary(entityId: string): string {
    if (!entityId) return 'Tap to search entities';
    if (this.hass && this.hass.states[entityId]) {
      const attrs = this.hass.states[entityId].attributes;
      if (attrs.area_name) return String(attrs.area_name);
    }
    return entityId;
  }

  private _getEntityDomainBadge(entityId: string): string {
    if (!entityId) return '';
    const domain = entityId.split('.')[0] ?? '';
    return domain.charAt(0).toUpperCase() + domain.slice(1).replace(/_/g, ' ');
  }

  private _getEntityIcon(entityId: string): string {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return 'mdi:help-circle-outline';
    const stateObj = this.hass.states[entityId];
    if (stateObj.attributes.icon) return String(stateObj.attributes.icon);
    return 'mdi:bookmark-outline';
  }

  private _getModalFilteredEntities(): string[] {
    if (!this.hass || !this.hass.states) return [];
    const all = Object.keys(this.hass.states).sort((a, b) => {
      return this._getEntityFriendlyName(a).localeCompare(this._getEntityFriendlyName(b));
    });
    const q = this._pickerSearchQuery.trim().toLowerCase();
    const dom = this._pickerDomainFilter;
    return all.filter((ent) => {
      if (dom !== 'all' && ent.split('.')[0] !== dom) return false;
      if (!q) return true;
      return ent.toLowerCase().includes(q) || this._getEntityFriendlyName(ent).toLowerCase().includes(q);
    });
  }

  private _getFilteredIcons(): string[] {
    const q = this._pickerSearchQuery.trim().toLowerCase();
    if (!q) return POPULAR_ICONS;
    return POPULAR_ICONS.filter(icon => icon.toLowerCase().includes(q));
  }

  private _isModuleEnabled(modId: string): boolean {
    return (this._config?.active_modules ?? []).includes(modId);
  }

  private _toggleModuleEnabled(modId: string): void {
    const list = [...(this._config?.active_modules ?? [])];
    const next = list.includes(modId) ? list.filter((id) => id !== modId) : [...list, modId];
    this._setDirectValue('active_modules', next);
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) return html``;

    const showGen = this._activeCategory === 'all' || this._activeCategory === 'general';
    const showSub = this._activeCategory === 'all' || this._activeCategory === 'subbuttons';
    const showSty = this._activeCategory === 'all' || this._activeCategory === 'styles';
    const showMod = this._activeCategory === 'all' || this._activeCategory === 'modules';

    return html`
      <div class="aurora-editor-root">
        ${this._statusToast ? html`<div class="aurora-toast">${this._statusToast}</div>` : html``}
        
        <div class="aurora-sticky-context">
          <div class="context-title">
            <ha-icon icon="mdi:alpha-a-box-outline"></ha-icon>
            <span>Aurora Suite • Configuration Hub</span>
          </div>
          ${this._renderCategoryTabs()}
        </div>

        <div class="hubs-container">
          ${showGen ? this._renderHeroIdentityHub() : html``}
          ${showGen ? this._renderCardSettingsHub() : html``}
          ${showGen ? this._renderStateContentHub() : html``}
          ${showGen ? this._renderActionsHub() : html``}
          ${showSub ? this._renderSubButtonsHub() : html``}
          ${showSty ? this._renderStylingHub() : html``}
          ${showMod ? this._renderModulesHub() : html``}
        </div>

        ${this._pickerOpen ? this._renderEntityPickerModal() : html``}
        ${this._iconPickerOpen ? this._renderIconPickerModal() : html``}
        ${this._statePickerOpen ? this._renderStatePickerModal() : html``}
        ${this._creatorOpen ? this._renderCreatorModal() : html``}
        ${this._importYamlOpen ? this._renderImportModal() : html``}
      </div>
    `;
  }

  private _renderCategoryTabs(): TemplateResult {
    const subCount = (this._config?.sub_button ?? []).length;
    const modCount = (this._config?.active_modules ?? []).length;

    return html`
      <div class="category-bar">
        <button class="cat-pill" ?data-active="${this._activeCategory === 'all'}" @click="${() => (this._activeCategory = 'all')}">All</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === 'general'}" @click="${() => (this._activeCategory = 'general')}">General</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === 'subbuttons'}" @click="${() => (this._activeCategory = 'subbuttons')}">Sub-buttons (${subCount})</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === 'styles'}" @click="${() => (this._activeCategory = 'styles')}">Styling</button>
        <button class="cat-pill" ?data-active="${this._activeCategory === 'modules'}" @click="${() => (this._activeCategory = 'modules')}">Modules (${modCount})</button>
      </div>
    `;
  }

  private _renderHeroIdentityHub(): TemplateResult {
    const cardType = this._config?.card_type ?? 'button';
    const buttonType = this._config?.button_type ?? 'switch';
    const entity = this._config?.entity ?? '';

    return html`
      <div class="aurora-hub-card hero-hub">
        <div class="hub-header-static">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <span>Card Identity & Primary Entity</span>
        </div>
        <div class="hub-body">
          <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById('cardTypeSelect')?.click()}">
            <div class="box-content">
              <span class="floating-label">Card type</span>
              <select id="cardTypeSelect" class="native-select" .value="${cardType}" @change="${(e: Event) => this._valueChanged(e, 'card_type')}">
                <option value="button">Button</option>
                <option value="pop-up">Pop-up</option>
                <option value="separator">Separator</option>
                <option value="cover">Cover</option>
                <option value="climate">Climate</option>
                <option value="media-player">Media player</option>
                <option value="empty-column">Empty column</option>
              </select>
            </div>
            <div class="box-controls">
              <button class="clear-btn" title="Reset" @click="${(e: Event) => { e.stopPropagation(); this._setDirectValue('card_type', 'button'); }}">✕</button>
              <span class="dropdown-caret" @click="${(e: Event) => { e.stopPropagation(); this.shadowRoot?.getElementById('cardTypeSelect')?.click(); }}">▼</span>
            </div>
          </div>

          ${cardType === 'button'
            ? html`
                <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById('buttonTypeSelect')?.click()}">
                  <div class="box-content">
                    <span class="floating-label">Button type</span>
                    <select id="buttonTypeSelect" class="native-select" .value="${buttonType}" @change="${(e: Event) => this._valueChanged(e, 'button_type')}">
                      <option value="switch">Switch</option>
                      <option value="slider">Slider</option>
                      <option value="state">State</option>
                      <option value="name">Name / Text</option>
                    </select>
                  </div>
                  <div class="box-controls">
                    <button class="clear-btn" title="Reset" @click="${(e: Event) => { e.stopPropagation(); this._setDirectValue('button_type', 'switch'); }}">✕</button>
                    <span class="dropdown-caret" @click="${(e: Event) => { e.stopPropagation(); this.shadowRoot?.getElementById('buttonTypeSelect')?.click(); }}">▼</span>
                  </div>
                </div>
              `
            : html``}

          ${cardType !== 'empty-column'
            ? html`
                <div class="section-caption">Entity (toggle)</div>
                <div class="ha-entity-box" @click="${() => this._openEntityPicker({ type: 'main' })}">
                  <div class="entity-icon-badge">
                    <ha-icon .icon="${this._getEntityIcon(entity)}"></ha-icon>
                  </div>
                  <div class="entity-text-col">
                    <span class="entity-primary">${this._getEntityFriendlyName(entity)}</span>
                    <span class="entity-secondary">${this._getEntitySecondary(entity)}</span>
                  </div>
                  <div class="box-controls">
                    ${entity
                      ? html`
                          <button class="clear-btn" title="Clear entity" @click="${(e: Event) => { e.stopPropagation(); this._setDirectValue('entity', undefined); }}">✕</button>
                        `
                      : html``}
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>
              `
            : html``}
        </div>
      </div>
    `;
  }

  private _renderCardSettingsHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.settings);
    const name = this._config?.name ?? '';
    const icon = this._config?.icon ?? '';
    const scrolling = this._config?.scrolling_effect !== false;
    const showIcon = this._config?.show_icon !== false;
    const prioritiseIcon = Boolean(this._config?.prioritise_icon);
    const showName = this._config?.show_name !== false;

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('settings')}">
          <div class="header-left">
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Card Display & Appearance</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Name</span>
                    <input type="text" class="native-input" .value="${name}" @input="${(e: Event) => this._valueChanged(e, 'name')}" />
                  </div>
                  <div class="box-controls">
                    <button class="clear-btn" title="Clear name" @click="${() => this._setDirectValue('name', undefined)}">✕</button>
                  </div>
                </div>
                
                <div class="ha-filled-box" @click="${() => this._openIconPicker({ type: 'icon_main' })}">
                  <div class="box-content">
                    <span class="floating-label">Optional - Icon</span>
                    <div class="icon-trigger-preview">
                      <ha-icon .icon="${icon || 'mdi:image-outline'}"></ha-icon>
                      <span>${icon || 'Select an icon...'}</span>
                    </div>
                  </div>
                  <div class="box-controls">
                    ${icon ? html`<button class="clear-btn" title="Clear icon" @click="${(e: Event) => { e.stopPropagation(); this._setDirectValue('icon', undefined); }}">✕</button>` : html``}
                    <span class="dropdown-caret">▼</span>
                  </div>
                </div>

                <div class="toggle-list">
                  ${this._renderToggleRow('Text scrolling effect', scrolling, (val) => this._setDirectValue('scrolling_effect', val))}${this._renderToggleRow('Show icon', showIcon, (val) => this._setDirectValue('show_icon', val))}
                  ${this._renderToggleRow('Prioritise icon over entity picture', prioritiseIcon, (val) => this._setDirectValue('prioritise_icon', val))}${this._renderToggleRow('Show name', showName, (val) => this._setDirectValue('show_name', val))}
                </div>
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderStateContentHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.states);
    const stateChips = this._config?.state_content ?? ['state'];

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('states')}">
          <div class="header-left">
            <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
            <span>State Content & Attributes</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                <div class="state-content-block">
                  <div class="chips-well">
                    <div class="chips-list">
                      ${stateChips.map(
                        (chip, idx) => html`
                          <div class="ha-chip">
                            <span class="chip-text">${this._formatChipLabel(chip)}</span>
                            <div class="chip-actions">
                              ${idx > 0
                                ? html`<button class="chip-shift-btn" title="Move Left" @click="${() => this._moveStateChip(idx, -1)}">◄</button>`
                                : html``}
                              ${idx < stateChips.length - 1
                                ? html`<button class="chip-shift-btn" title="Move Right" @click="${() => this._moveStateChip(idx, 1)}">►</button>`
                                : html``}
                              <button class="chip-remove" title="Remove" @click="${() => this._removeStateChip(idx)}">✕</button>
                            </div>
                          </div>
                        `
                      )}
                    </div>
                    <button class="chip-add-btn" @click="${() => (this._statePickerOpen = true)}">
                      <span>＋</span><span>Add attribute</span>
                    </button>
                  </div>
                </div>
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderActionsHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.actions);
    const iconAction = this._config?.icon_tap_action?.action ?? 'toggle';
    const cardAction = this._config?.tap_action?.action ?? 'toggle';
    const holdAction = this._config?.hold_action?.action ?? 'more-info';

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('actions')}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <span>Actions & Touch Behaviors</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                ${this._renderActionSelector('Tap action on icon', 'icon_tap_action', iconAction, 'iconActionSel')}
                ${this._renderActionSelector('Tap action on card', 'tap_action', cardAction, 'cardActionSel')}${this._renderActionSelector('Hold behavior', 'hold_action', holdAction, 'holdActionSel')}
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderSubButtonsHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.subbuttons);
    const subButtons = this._config?.sub_button ?? [];

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('subbuttons')}">
          <div class="header-left">
            <ha-icon icon="mdi:shape-square-plus"></ha-icon>
            <span>Sub-Buttons Matrix</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                ${subButtons.map(
                  (sub, idx) => {
                    const tapAct = (sub as any).tap_action?.action ?? 'toggle';
                    const holdAct = (sub as any).hold_action?.action ?? 'more-info';
                    const dblTapAct = (sub as any).double_tap_action?.action ?? 'none';
                    
                    return html`
                    <div class="sub-button-container">
                      <div class="sub-button-row">
                        <button type="button" class="sub-icon-btn" title="Change Icon" @click="${() => this._openIconPicker({ type: 'icon_sub', index: idx })}">
                          <ha-icon .icon="${sub.icon ?? 'mdi:power'}"></ha-icon>
                        </button>
                        <button type="button" class="sub-entity-picker-btn" title="Change Entity" @click="${() => this._openEntityPicker({ type: 'sub', index: idx })}">
                          <span class="sub-ent-label">${this._getEntityFriendlyName(sub.entity ?? '')}</span>
                          <span class="dropdown-caret">▼</span>
                        </button>
                        <button class="icon-action-btn" title="Action Settings" @click="${() => this._toggleSubButtonSettings(idx)}">
                          <ha-icon icon="mdi:cog"></ha-icon>
                        </button>
                        <button class="danger-icon-btn" title="Remove sub-button" @click="${() => this._removeSubButton(idx)}">✕</button>
                      </div>
                      
                      ${this._expandedSubButtons[idx]
                        ? html`
                            <div class="module-settings-drawer">
                              <div class="section-caption" style="margin-top:0;">Sub-Button Actions</div>
                              ${this._renderSubActionSelector(idx, 'Tap action', 'tap_action', tapAct, `subTapSel_${idx}`)}
                              ${this._renderSubActionSelector(idx, 'Hold behavior', 'hold_action', holdAct, `subHoldSel_${idx}`)}
                              ${this._renderSubActionSelector(idx, 'Double tap action', 'double_tap_action', dblTapAct, `subDblTapSel_${idx}`)}
                            </div>
                          `
                        : html``}
                    </div>
                  `}
                )}
                <button class="chip-add-btn" @click="${this._addSubButton}"><span>＋</span><span>Add sub-button</span></button>
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderStylingHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.styling);
    const preset = this._config?.vibe_preset ?? 'aurora_lumina';
    const customStyles = this._config?.custom_styles ?? '';

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('styling')}">
          <div class="header-left">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Styling & Vibe Presets</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById('vibePresetSelect')?.click()}">
                  <div class="box-content">
                    <span class="floating-label">Aurora Aesthetic Vibe Preset</span>
                    <select id="vibePresetSelect" class="native-select" .value="${preset}" @change="${(e: Event) => this._valueChanged(e, 'vibe_preset')}">
                      <option value="aurora_lumina">Aurora Lumina (Frosted Glass)</option>
                      <option value="crimson_midnight">Crimson Midnight (Gothic Dark)</option>
                      <option value="obsidian_minimal">Obsidian Minimal</option>
                      <option value="ha_native">Home Assistant Native Surface</option>
                    </select>
                  </div>
                  <div class="box-controls">
                    <span class="dropdown-caret" @click="${(e: Event) => { e.stopPropagation(); this.shadowRoot?.getElementById('vibePresetSelect')?.click(); }}">▼</span>
                  </div>
                </div>
                <textarea class="code-textarea" rows="4" placeholder=".aurora-card { --aurora-blur: 24px; }" .value="${customStyles}" @input="${(e: Event) => this._valueChanged(e, 'custom_styles')}"></textarea>
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderModulesHub(): TemplateResult {
    const isOpen = Boolean(this._openHubs.modules);
    const allModules = moduleRegistry.getAllModules();

    return html`
      <div class="aurora-hub-card" ?data-open="${isOpen}">
        <div class="hub-header" @click="${() => this._toggleHub('modules')}">
          <div class="header-left">
            <ha-icon icon="mdi:puzzle"></ha-icon>
            <span>Extension Modules Ecosystem</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
          ? html`
              <div class="hub-body">
                <div class="module-action-bar">
                  <button class="action-hub-btn primary" @click="${() => (this._creatorOpen = true)}">
                    <ha-icon icon="mdi:plus-box-outline"></ha-icon>
                    <span>Create New Module</span>
                  </button>
                  <button class="action-hub-btn secondary" @click="${() => (this._importYamlOpen = true)}">
                    <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                    <span>Import YAML</span>
                  </button>
                </div>

                <div class="module-subtabs">
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === 'my_modules'}" @click="${() => (this._moduleSubTab = 'my_modules')}">Installed Modules (${allModules.length})</button>
                  <button class="mod-tab" ?data-active="${this._moduleSubTab === 'store'}" @click="${() => (this._moduleSubTab = 'store')}">Module Store</button>
                </div>

                ${this._moduleSubTab === 'my_modules' ? this._renderMyModulesView(allModules) : this._renderModuleStoreView()}
              </div>
            `
          : html``}
      </div>
    `;
  }

  private _renderMyModulesView(allModules: AuroraModuleDefinition[]): TemplateResult {
    return html`
      <div class="modules-grid-list">
        ${allModules.map(
          (mod) => html`
            <div class="module-hub-card">
              <div class="mod-hub-top">
                <div class="mod-title-row">
                  <ha-icon icon="mdi:puzzle-outline"></ha-icon>
                  <span class="mod-name">${mod.name}</span>
                  <span class="mod-version">${mod.version}</span>
                  <span class="mod-type-badge">${mod.type}</span>
                </div>
                <p class="mod-desc">${mod.description}</p>
              </div>
              
              <div class="mod-hub-footer">
                <div class="scope-toggles">
                  <label class="scope-toggle-pill" ?data-active="${this._isModuleEnabled(mod.id)}">
                    <input type="checkbox" .checked="${this._isModuleEnabled(mod.id)}" @change="${() => this._toggleModuleEnabled(mod.id)}" hidden />
                    <span>${this._isModuleEnabled(mod.id) ? 'Enabled' : 'Disabled'}</span>
                  </label>
                  
                  <button class="icon-action-btn" title="Module Settings" @click="${() => this._toggleModuleSettings(mod.id)}">
                    <ha-icon icon="mdi:cog"></ha-icon>
                  </button>

                  ${!mod.builtIn
                    ? html`
                        <button class="icon-action-btn" title="Edit Module" @click="${() => this._editUserModule(mod)}">
                          <ha-icon icon="mdi:pencil"></ha-icon>
                        </button>
                        <button class="danger-icon-btn" title="Delete Module" @click="${() => {
                          moduleRegistry.deleteUserModule(mod.id);
                          this.requestUpdate();
                          this._showToast('Module deleted');
                        }}">
                          <ha-icon icon="mdi:delete"></ha-icon>
                        </button>
                      `
                    : html``}
                </div>
              </div>

              ${this._expandedModules[mod.id]
                ? html`
                    <div class="module-settings-drawer">
                      <div class="section-caption">Module Configuration</div>
                      <p class="muted-note" style="text-align:left; padding: 2px 0;">Settings based on schema: <code>${mod.id}</code></p>
                      <textarea 
                        class="code-textarea" 
                        rows="4" 
                        placeholder="key: value"
                        .value="${this._getModuleConfigString(mod.id)}" 
                        @input="${(e: Event) => this._setModuleConfigString(mod.id, (e.target as HTMLTextAreaElement).value)}"
                      ></textarea>
                    </div>
                  `
                : html``}
            </div>
          `
        )}
      </div>
    `;
  }

  private _renderModuleStoreView(): TemplateResult {
    return html`<div class="store-cards-list"><p class="muted-note">Community module store connected. All verified modules are loaded.</p></div>`;
  }

  private _renderCreatorModal(): TemplateResult {
    return html`
      <div class="picker-backdrop" @click="${() => (this._creatorOpen = false)}">
        <div class="creator-sheet" @click="${(e: Event) => e.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Aurora Module Studio</span>
            <button class="modal-close-btn" @click="${() => (this._creatorOpen = false)}">Close</button>
          </div>
          <div class="creator-body">
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Type</span>
                <select id="modTypeSel" class="native-select" .value="${this._creatorDraft.type}" @change="${(e: Event) => (this._creatorDraft = { ...this._creatorDraft, type: (e.target as HTMLSelectElement).value as any })}">
                  <option value="base-extension">Base Extension (Style/Behavior Injector)</option>
                  <option value="custom-card">Custom Card (Standalone Element)</option>
                </select>
              </div>
              <div class="box-controls">
                <span class="dropdown-caret" @click="${() => this.shadowRoot?.getElementById('modTypeSel')?.click()}">▼</span>
              </div>
            </div>

            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Unique ID</span>
                <input type="text" class="native-input" .value="${this._creatorDraft.id}" @input="${(e: Event) => (this._creatorDraft = { ...this._creatorDraft, id: (e.target as HTMLInputElement).value })}" />
              </div>
            </div>
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Module Display Name</span>
                <input type="text" class="native-input" .value="${this._creatorDraft.name}" @input="${(e: Event) => (this._creatorDraft = { ...this._creatorDraft, name: (e.target as HTMLInputElement).value })}" />
              </div>
            </div>

            <div class="section-caption">Supported Card Types (Visual Pills)</div>
            <div class="card-pills-grid">
              ${SUPPORTED_CARD_TYPES.map(
                (c) => html`
                  <button
                    type="button"
                    class="card-pill-toggle"
                    ?data-selected="${this._creatorDraft.supportedCards.includes(c.id)}"
                    @click="${() => {
                      const list = [...this._creatorDraft.supportedCards];
                      const next = list.includes(c.id) ? list.filter((id) => id !== c.id) : [...list, c.id];
                      this._creatorDraft = { ...this._creatorDraft, supportedCards: next };
                    }}"
                  >
                    ${c.label}
                  </button>
                `
              )}
            </div>

            <div class="section-caption">CSS / JS Code Template</div>
            <textarea class="code-textarea" rows="6" .value="${this._creatorDraft.codeTemplate}" @input="${(e: Event) => (this._creatorDraft = { ...this._creatorDraft, codeTemplate: (e.target as HTMLInputElement).value })}"></textarea>

            <button
              class="chip-add-btn primary-save"
              @click="${() => {
                moduleRegistry.registerUserModule({ ...this._creatorDraft });
                this._creatorOpen = false;
                this._showToast('Custom module created and installed successfully!');
                this.requestUpdate();
              }}"
            >
              <span>💾</span><span>Save & Install Module</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderImportModal(): TemplateResult {
    return html`
      <div class="picker-backdrop" @click="${() => (this._importYamlOpen = false)}">
        <div class="creator-sheet" @click="${(e: Event) => e.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Import Module from YAML</span>
            <button class="modal-close-btn" @click="${() => (this._importYamlOpen = false)}">Cancel</button>
          </div>
          <div class="creator-body">
            <p class="muted-note">Paste your module YAML definition below:</p>
            <textarea class="code-textarea" rows="10" placeholder="my_imported_module:&#10;  type: base-extension&#10;  setting: value" .value="${this._importYamlText}" @input="${(e: Event) => (this._importYamlText = (e.target as HTMLInputElement).value)}"></textarea>
            <button
              class="chip-add-btn primary-save"
              @click="${() => {
                this._importYamlOpen = false;
                this._showToast('Module YAML successfully parsed and imported!');
              }}"
            >
              <span>📥</span><span>Import Definition</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderToggleRow(label: string, checked: boolean, onChange: (val: boolean) => void): TemplateResult {
    return html`
      <label class="ha-toggle-row">
        <button type="button" role="switch" class="ha-pill-switch" ?data-checked="${checked}" @click="${() => onChange(!checked)}">
          <span class="switch-thumb"></span>
        </button>
        <span class="toggle-label">${label}</span>
      </label>
    `;
  }

  private _renderActionSelector(label: string, field: string, currentAction: string, selectId: string): TemplateResult {
    return html`
      <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById(selectId)?.click()}">
        <div class="box-content">
          <span class="floating-label">${label}</span>
          <select id="${selectId}" class="native-select" .value="${currentAction}" @change="${(e: Event) => this._actionChanged(e, field)}">
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate</option>
            <option value="call-service">Call service</option>
            <option value="none">No action</option>
          </select>
        </div>
        <div class="box-controls">
          <button class="clear-btn" title="Reset" @click="${(e: Event) => { e.stopPropagation(); this._actionChangedByVal(field, 'toggle'); }}">✕</button>
          <span class="dropdown-caret" @click="${(e: Event) => { e.stopPropagation(); this.shadowRoot?.getElementById(selectId)?.click(); }}">▼</span>
        </div>
      </div>
    `;
  }

  private _renderSubActionSelector(index: number, label: string, field: string, currentAction: string, selectId: string): TemplateResult {
    return html`
      <div class="ha-filled-box" @click="${() => this.shadowRoot?.getElementById(selectId)?.click()}">
        <div class="box-content">
          <span class="floating-label">${label}</span>
          <select id="${selectId}" class="native-select" .value="${currentAction}" @change="${(e: Event) => this._subActionChanged(index, field, e)}">
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate</option>
            <option value="call-service">Call service</option>
            <option value="none">No action</option>
          </select>
        </div>
        <div class="box-controls">
          <button class="clear-btn" title="Reset" @click="${(e: Event) => { e.stopPropagation(); this._subActionChangedByVal(index, field, 'toggle'); }}">✕</button>
          <span class="dropdown-caret" @click="${(e: Event) => { e.stopPropagation(); this.shadowRoot?.getElementById(selectId)?.click(); }}">▼</span>
        </div>
      </div>
    `;
  }

  private _formatChipLabel(chip: string): string {
    const found = AVAILABLE_STATE_ATTRIBUTES.find((a) => a.id === chip);
    return found ? found.label : chip;
  }

  private _addSpecificStateChip(attrId: string): void {
    if (!this._config) return;
    const current = [...(this._config.state_content ?? ['state'])];
    if (!current.includes(attrId)) {
      current.push(attrId);
      this._setDirectValue('state_content', current);
    }
  }

  private _moveStateChip(index: number, direction: number): void {
    if (!this._config) return;
    const current = [...(this._config.state_content ?? [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    this._setDirectValue('state_content', current);
  }

  private _removeStateChip(index: number): void {
    if (!this._config) return;
    const current = [...(this._config.state_content ?? [])];
    this._setDirectValue('state_content', current.filter((_, i) => i !== index));
  }

  private _valueChanged(e: Event, field: string): void {
    if (!this._config) return;
    const val = (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    this._setDirectValue(field, val === '' ? undefined : val);
  }

  private _setDirectValue(field: string, value: any): void {
    if (!this._config) return;
    this._config = { ...this._config, [field]: value };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _actionChanged(e: Event, field: string): void {
    this._actionChangedByVal(field, (e.target as HTMLSelectElement).value);
  }

  private _actionChangedByVal(field: string, val: string): void {
    if (!this._config) return;
    const existing = (this._config[field] as Record<string, any>) ?? {};
    this._config = { ...this._config, [field]: { ...existing, action: val } };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _subActionChanged(index: number, actionType: string, e: Event): void {
    this._subActionChangedByVal(index, actionType, (e.target as HTMLSelectElement).value);
  }

  private _subActionChangedByVal(index: number, actionType: string, val: string): void {
    if (!this._config || !this._config.sub_button) return;
    const updated = [...this._config.sub_button];
    const existingAction = (updated[index] as any)[actionType] ?? {};
    updated[index] = { ...updated[index], [actionType]: { ...existingAction, action: val } };
    this._setDirectValue('sub_button', updated);
  }

  private _addSubButton(): void {
    if (!this._config) return;
    const current = [...(this._config.sub_button ?? [])];
    current.push({ icon: 'mdi:power', show_state: true });
    this._setDirectValue('sub_button', current);
  }

  private _updateSubButton(index: number, key: keyof AuroraSubButtonConfig, val: any): void {
    if (!this._config || !this._config.sub_button) return;
    const updated = [...this._config.sub_button];
    updated[index] = { ...updated[index], [key]: val === '' ? undefined : val };
    this._setDirectValue('sub_button', updated);
  }

  private _removeSubButton(index: number): void {
    if (!this._config || !this._config.sub_button) return;
    this._setDirectValue('sub_button', this._config.sub_button.filter((_, i) => i !== index));
  }

  private _renderStatePickerModal(): TemplateResult {
    const currentChips = this._config?.state_content ?? [];
    const available = AVAILABLE_STATE_ATTRIBUTES.filter((attr) => !currentChips.includes(attr.id));

    return html`
      <div class="picker-backdrop" @click="${() => (this._statePickerOpen = false)}">
        <div class="picker-sheet" @click="${(e: Event) => e.stopPropagation()}">
          <div class="picker-header">
            <span class="picker-sheet-title">Select or Type Attribute</span>
            <button class="modal-close-btn" @click="${() => (this._statePickerOpen = false)}">Cancel</button>
          </div>
          
          <div class="creator-body" style="padding-bottom: 0;">
            <div class="ha-filled-box">
              <div class="box-content">
                <span class="floating-label">Custom Attribute / State Key</span>
                <input 
                  type="text" 
                  class="native-input" 
                  placeholder="e.g. media_title, fan_speed..." 
                  .value="${this._customAttributeInput}" 
                  @input="${(e: Event) => (this._customAttributeInput = (e.target as HTMLInputElement).value)}" 
                />
              </div>
              <button 
                class="chip-add-btn primary-save" 
                style="margin-top:0;"
                @click="${() => {
                  if (this._customAttributeInput.trim()) {
                    this._addSpecificStateChip(this._customAttributeInput.trim());
                    this._customAttributeInput = '';
                    this._statePickerOpen = false;
                  }
                }}"
              >
                <span>Add Custom</span>
              </button>
            </div>
            <div class="section-caption" style="margin-top: 12px;">Or choose from common attributes:</div>
          </div>

          <div class="picker-list">
            ${available.map(
              (attr) => html`
                <div
                  class="picker-row"
                  @click="${() => {
                    this._addSpecificStateChip(attr.id);
                    this._statePickerOpen = false;
                  }}"
                >
                  <ha-icon icon="mdi:chip"></ha-icon>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${attr.label}</span>
                    <span class="picker-row-sub">Attribute key: <code>${attr.id}</code></span>
                  </div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderEntityPickerModal(): TemplateResult {
    const list = this._getModalFilteredEntities().slice(0, 100);
    return html`
      <div class="picker-backdrop" @click="${this._closeEntityPicker}">
        <div class="picker-sheet" @click="${(e: Event) => e.stopPropagation()}">
          <div class="picker-header">
            <input type="text" class="picker-search-input" placeholder="Search entities..." .value="${this._pickerSearchQuery}" @input="${(e: Event) => (this._pickerSearchQuery = (e.target as HTMLInputElement).value)}" autofocus />
            <button class="modal-close-btn" @click="${this._closeEntityPicker}">Cancel</button>
          </div>
          <div class="picker-list">
            ${list.map(
              (ent) => html`
                <div class="picker-row" @click="${() => this._selectEntityFromModal(ent)}">
                  <ha-icon .icon="${this._getEntityIcon(ent)}"></ha-icon>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${this._getEntityFriendlyName(ent)}</span>
                    <span class="picker-row-sub">${ent}</span>
                  </div>
                  <span class="picker-row-domain">${this._getEntityDomainBadge(ent)}</span>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderIconPickerModal(): TemplateResult {
    const list = this._getFilteredIcons();
    return html`
      <div class="picker-backdrop" @click="${this._closeIconPicker}">
        <div class="picker-sheet" @click="${(e: Event) => e.stopPropagation()}">
          <div class="picker-header">
            <input type="text" class="picker-search-input" placeholder="Search icons (e.g., mdi:home)..." .value="${this._pickerSearchQuery}" @input="${(e: Event) => (this._pickerSearchQuery = (e.target as HTMLInputElement).value)}" autofocus />
            <button class="modal-close-btn" @click="${this._closeIconPicker}">Cancel</button>
          </div>
          <div class="picker-list icon-grid">
            ${list.map(
              (iconStr) => html`
                <div class="icon-tile" @click="${() => this._selectIconFromModal(iconStr)}" title="${iconStr}">
                  <ha-icon .icon="${iconStr}"></ha-icon>
                  <span>${iconStr.replace('mdi:', '')}</span>
                </div>
              `
            )}
            ${list.length === 0
              ? html`<div class="picker-empty" style="grid-column: 1 / -1;">No matching icons found. Type a valid MDI string to manually select.</div>`
              : html``}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #e1e1e1);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }

    .aurora-editor-root {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0 24px 0;
    }

    .aurora-sticky-context {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--card-background-color, #1c1c1c);
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .context-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-color, #03a9f4);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .aurora-toast {
      position: sticky;
      top: 6px;
      z-index: 100;
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    .category-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .cat-pill {
      background: var(--secondary-background-color, #202124);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 18px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .cat-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .hubs-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .aurora-hub-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 16px;
      background: var(--card-background-color, #1c1c1c);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .hero-hub {
      border-color: var(--primary-color, #03a9f4);
    }

    .hub-header,
    .hub-header-static {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      cursor: pointer;
      user-select: none;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.02);
    }

    .hub-header-static {
      cursor: default;
      background: rgba(3, 169, 244, 0.06);
    }

    .hub-header .header-left,
    .hub-header-static {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chevron {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .hub-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
    }

    .section-caption {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      margin-top: 4px;
    }

    .ha-filled-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border-bottom: 1px solid var(--secondary-text-color, rgba(255, 255, 255, 0.4));
      border-radius: 4px 4px 0 0;
      padding: 6px 12px;
      min-height: 44px;
      cursor: pointer;
    }

    .box-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
      pointer-events: none;
    }

    .floating-label {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .native-select,
    .native-input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 15px;
      padding: 2px 0;
      outline: none;
      width: 100%;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      pointer-events: auto;
    }

    .native-select option {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #ffffff);
    }

    .icon-trigger-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      color: var(--primary-text-color, #ffffff);
      font-size: 14px;
      pointer-events: auto;
      cursor: pointer;
    }

    .box-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 14px;
      cursor: pointer;
      padding: 4px 6px;
    }

    .dropdown-caret {
      font-size: 10px;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      padding: 4px;
    }

    .ha-entity-box {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border-bottom: 1px solid var(--secondary-text-color, rgba(255, 255, 255, 0.4));
      border-radius: 4px 4px 0 0;
      padding: 8px 12px;
      min-height: 48px;
      cursor: pointer;
    }

    .entity-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #9b9b9b);
    }

    .entity-text-col {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .entity-primary {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entity-secondary {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ha-toggle-row {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
    }

    .ha-pill-switch {
      position: relative;
      width: 48px;
      height: 26px;
      border-radius: 16px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.12));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      padding: 0;
      cursor: pointer;
    }

    .ha-pill-switch[data-checked] {
      background: var(--primary-color, #03a9f4);
    }

    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      transition: transform 0.2s ease;
    }

    .ha-pill-switch[data-checked] .switch-thumb {
      transform: translateX(20px);
    }

    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color, #e1e1e1);
    }

    .chips-well {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ha-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--card-background-color, rgba(255, 255, 255, 0.08));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 13px;
      color: var(--primary-text-color, #ffffff);
    }

    .chip-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 4px;
    }

    .chip-shift-btn,
    .chip-remove {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      font-size: 11px;
      padding: 2px 4px;
    }

    .chip-shift-btn:hover,
    .chip-remove:hover {
      color: var(--primary-text-color, #ffffff);
    }

    .chip-add-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 18px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
    }

    .primary-save {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      font-weight: 600;
      margin-top: 8px;
    }

    .sub-button-container {
      display: flex;
      flex-direction: column;
      gap: 0;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      border-radius: 8px;
      padding: 8px 12px;
    }

    .sub-button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .sub-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      color: var(--primary-text-color, #ffffff);
      cursor: pointer;
      transition: background 0.2s;
    }

    .sub-icon-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .sub-entity-picker-btn {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      cursor: pointer;
      font-size: 14px;
      text-align: left;
    }

    .danger-icon-btn {
      background: transparent;
      border: none;
      color: #f44336;
      cursor: pointer;
      font-size: 15px;
    }

    .code-textarea {
      width: 100%;
      box-sizing: border-box;
      background: var(--secondary-background-color, rgba(0,0,0,0.2));
      color: var(--primary-text-color, #e2e8f0);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 13px;
      outline: none;
    }

    .module-action-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }

    .action-hub-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
    }

    .action-hub-btn.primary {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .action-hub-btn.secondary {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      color: var(--primary-text-color, #ffffff);
    }

    .module-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      margin-top: 6px;
    }

    .mod-tab {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      padding: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .mod-tab[data-active] {
      color: var(--primary-text-color, #ffffff);
      border-bottom: 2px solid var(--primary-color, #03a9f4);
    }

    .modules-grid-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    .module-hub-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 12px;
      padding: 12px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.02));
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .mod-hub-top {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mod-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mod-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      flex: 1;
    }

    .mod-version {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 6px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .mod-type-badge {
      font-size: 10px;
      background: rgba(3, 169, 244, 0.15);
      color: var(--primary-color, #03a9f4);
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 600;
    }

    .mod-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #b0b0b0);
      margin: 0;
    }

    .mod-hub-footer {
      display: flex;
      justify-content: flex-end;
    }

    .scope-toggles {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .scope-toggle-pill {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
    }

    .scope-toggle-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    .icon-action-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }

    .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #ffffff);
    }

    .icon-action-btn ha-icon, .danger-icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .module-settings-drawer {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .card-pills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 4px;
    }

    .card-pill-toggle {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 10px;
      padding: 8px;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
    }

    .card-pill-toggle[data-selected] {
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
    }

    .picker-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.65);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }

    .picker-sheet, .creator-sheet {
      width: 100%;
      max-width: 540px;
      height: 84vh;
      background: var(--card-background-color, #141414);
      border-radius: 20px 20px 0 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .creator-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
    }

    .picker-sheet-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .picker-search-input {
      flex: 1;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 8px;
      padding: 8px 12px;
      color: var(--primary-text-color, #ffffff);
      outline: none;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }

    .picker-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .picker-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
      cursor: pointer;
    }

    .picker-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .picker-row-main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .picker-row-title {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
    }

    .picker-row-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 14px 6px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      cursor: pointer;
      color: var(--primary-text-color, #ffffff);
      transition: all 0.2s ease;
    }

    .icon-tile:hover {
      background: rgba(3, 169, 244, 0.15);
      border-color: var(--primary-color, #03a9f4);
      transform: translateY(-2px);
    }

    .icon-tile ha-icon {
      font-size: 24px;
    }

    .icon-tile span {
      font-size: 10px;
      text-align: center;
      word-break: break-all;
      color: var(--secondary-text-color, #9b9b9b);
      line-height: 1.2;
    }

    .picker-empty, .muted-note {
      padding: 12px;
      text-align: center;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 13px;
    }
  `;
}