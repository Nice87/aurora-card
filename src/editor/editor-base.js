var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent } from '../utils/hass-connect';
const SUPPORTED_CARD_TYPES = [
    { id: 'button', label: 'Button' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'climate', label: 'Thermostat' },
    { id: 'cover', label: 'Cover' },
    { id: 'horizontal-buttons-stack', label: 'Horizontal buttons stack' },
    { id: 'media-player', label: 'Media player' },
    { id: 'pop-up', label: 'Pop-up' },
    { id: 'select', label: 'Select' },
    { id: 'separator', label: 'Separator' },
    { id: 'sub-buttons', label: 'Sub-buttons' },
    { id: 'energy-flow', label: 'Energy Flow Matrix' },
    { id: 'security-matrix', label: 'Security & Camera Hub' },
    { id: 'hvac-zoning', label: 'HVAC & Storage Heating' },
    { id: 'mesh-topology', label: 'Zigbee / Matter Mesh' },
];
const DEFAULT_INSTALLED_MODULES = [
    {
        id: 'card_backdrop_image',
        name: 'Card Backdrop Image',
        version: 'v1.2.0',
        creator: 'Aurora Studio',
        description: 'Add a configurable image backdrop to an individual card or all cards. Pick an image from Home Assistant media, enter a direct URL, and fine-tune layout, blur, scale, and overlay opacity.',
        supportedCards: ['button', 'climate', 'media-player', 'pop-up', 'cover'],
        allCards: true,
        codeTemplate: '.aurora-card {\n  background-image: url("${module.image_url}");\n  background-size: ${module.size};\n  background-position: ${module.pos_x}% ${module.pos_y}%;\n}',
        editorSchemaYaml: 'image_url:\n  type: string\nsize:\n  type: select\n  options: [cover, contain]\nimage_opacity:\n  type: number\n  default: 100',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'card_backdrop_image:\n  background_image:\n    media_content_id: media-source://media_source/local/bg.jpg\n    media_content_type: image/jpeg\n  size: cover\n  position: center\n  repeat: no-repeat\n  image_opacity: 100\n  overlay_enabled: true\n  overlay_color: "#000000"\n  overlay_opacity: 35\n  blur: 0\n  scale: 100',
        builtIn: true,
    },
    {
        id: 'multi_section_card',
        name: 'Multi Section Card',
        version: 'v1.1.0',
        creator: 'dksnbx',
        description: 'Splits the card into 2, 3, or 4 sections, each showing an entity with a circular icon, optional name and state - matching the default card button look. Each section is tappable: opens more-info by default, or navigates to a pop-up hash.',
        supportedCards: ['button', 'separator'],
        allCards: false,
        codeTemplate: '/* Multi-section flex layout injection */\n.aurora-multi-section {\n  display: grid;\n  grid-template-columns: repeat(${module.section_count}, 1fr);\n  gap: 8px;\n}',
        editorSchemaYaml: 'section_count:\n  type: select\n  options: ["2", "3", "4"]\nhide_default_content:\n  type: boolean',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'multi_section_card:\n  section_count: "3"\n  entity_1: sensor.temperature\n  icon_1: mdi:thermometer\n  show_name_1: true\n  name_1: "Temperature"\n  show_state_1: true\n  entity_2: sensor.pressure\n  icon_2: mdi:gauge\n  show_state_2: true\n  entity_3: sensor.humidity\n  icon_3: mdi:water-percent\n  show_state_3: true',
        builtIn: true,
    },
    {
        id: 'conditional_slider_coloring',
        name: 'Conditional slider button coloring',
        version: 'v1.0.4',
        creator: 'Clooos / Aurora',
        description: 'Allows you to change slider colors dynamically based on entity states, numeric thresholds, or attribute conditions. Settings can be applied to this card or across all cards.',
        supportedCards: ['button', 'climate', 'cover', 'media-player'],
        allCards: false,
        codeTemplate: '.aurora-slider-fill {\n  background: ${state > 22 ? "#ef4444" : "#38bdf8"} !important;\n}',
        editorSchemaYaml: 'default_slider_color:\n  type: string\nconditions:\n  type: list',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'conditional_slider_coloring:\n  default_color: "var(--primary-color)"\n  conditions:\n    - condition: numeric_state\n      above: 21\n      color: "#ff5733"',
        builtIn: true,
    },
    {
        id: 'bubble_chips',
        name: 'Bubble Chips',
        version: 'v1.3.0',
        creator: 'Aurora Community',
        description: 'Transforms compact button and sub-button cards into floating pill-shaped status chips with customizable icon borders and compact padding.',
        supportedCards: ['button', 'sub-buttons'],
        allCards: false,
        codeTemplate: '.aurora-card {\n  border-radius: 999px !important;\n  min-height: 36px !important;\n  padding: 4px 12px !important;\n}',
        editorSchemaYaml: 'chip_height:\n  type: number\n  default: 36',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'bubble_chips:\n  chip_height: 36\n  compact_mode: true',
        builtIn: true,
    },
    {
        id: 'accent_color_picker',
        name: 'Accent Color Picker',
        version: 'v1.1.2',
        creator: 'Aurora Studio',
        description: 'Override the active glow, icon tint, and glassmorphism border accent color for individual cards using hex, RGB, or theme color tokens.',
        supportedCards: ['button', 'climate', 'cover', 'media-player', 'energy-flow'],
        allCards: true,
        codeTemplate: ':host {\n  --aurora-accent-color: ${module.accent_color};\n}',
        editorSchemaYaml: 'accent_color:\n  type: string\n  default: "#38bdf8"',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'accent_color_picker:\n  accent_color: "#e11d48"\n  glow_intensity: 45',
        builtIn: true,
    },
    {
        id: 'icon_border_progress',
        name: 'Icon Border Progress',
        version: 'v1.0.8',
        creator: 'Aurora Community',
        description: 'Renders a circular SVG radial progress ring around the main card icon or sub-button icon bound to battery level, brightness, or humidity.',
        supportedCards: ['button', 'climate', 'sensor', 'sub-buttons'],
        allCards: false,
        codeTemplate: '.entity-icon-badge {\n  box-shadow: inset 0 0 0 2px var(--primary-color);\n}',
        editorSchemaYaml: 'progress_entity:\n  type: entity\nstroke_width:\n  type: number',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'icon_border_progress:\n  progress_entity: sensor.livingroom_humidity\n  stroke_width: 3',
        builtIn: true,
    },
    {
        id: 'collapsible_sub_button_groups',
        name: 'Collapsible Sub Button Groups',
        version: 'v1.2.1',
        creator: 'Aurora Studio',
        description: 'Groups multiple sub-buttons into an expandable drawer badge that unfolds smoothly when tapped, saving horizontal space on mobile dashboards.',
        supportedCards: ['button', 'climate', 'media-player', 'sub-buttons'],
        allCards: true,
        codeTemplate: '.sub-button-group {\n  transition: max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}',
        editorSchemaYaml: 'group_icon:\n  type: icon\nauto_collapse_seconds:\n  type: number',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'collapsible_sub_button_groups:\n  group_icon: mdi:dots-horizontal\n  auto_collapse_seconds: 10',
        builtIn: true,
    },
];
const STORE_COMMUNITY_MODULES = [
    {
        id: 'animated_weather_icons',
        name: 'Animated Weather Icon',
        version: 'v1.4.0',
        creator: 'MeteoUX',
        description: 'Replaces static weather and temperature icons with smooth keyframe-animated SVG rain, snow, sunbeams, and wind effects.',
        supportedCards: ['button', 'weather-radar', 'climate'],
        allCards: true,
        codeTemplate: '@keyframes auroraPulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.08); }\n}\n.entity-icon-badge ha-icon { animation: auroraPulse 3s infinite ease-in-out; }',
        editorSchemaYaml: 'animation_speed:\n  type: string\n  default: "3s"',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'animated_weather_icons:\n  animation_speed: "3s"',
    },
    {
        id: 'crimson_gothic_glass',
        name: 'Crimson Midnight Gothic Shader',
        version: 'v2.0.0',
        creator: 'Aurora Lumina',
        description: 'Applies deep midnight-blue and crimson-undertone frosted glass with metallic gold and silver border highlights.',
        supportedCards: ['button', 'pop-up', 'media-player', 'climate'],
        allCards: true,
        codeTemplate: '.aurora-card {\n  background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(136, 19, 55, 0.42)) !important;\n  border: 1px solid rgba(212, 175, 55, 0.35) !important;\n}',
        editorSchemaYaml: 'crimson_intensity:\n  type: number\n  default: 42',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'crimson_gothic_glass:\n  crimson_intensity: 42\n  metallic_accent: gold',
    },
    {
        id: 'timer_progress_bar',
        name: 'Timer Progress Bar',
        version: 'v1.1.5',
        creator: 'ChronoHA',
        description: 'Displays a live countdown bar along the bottom edge of any card linked to a timer, washing machine cycle, or off-peak charging window.',
        supportedCards: ['button', 'hvac-zoning', 'ev-charger'],
        allCards: false,
        codeTemplate: '.aurora-timer-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 3px;\n  background: var(--primary-color);\n}',
        editorSchemaYaml: 'timer_entity:\n  type: entity',
        suggestionRulesYaml: '',
        computedSuggestionsJs: '',
        yamlExample: 'timer_progress_bar:\n  timer_entity: timer.octopus_go_window',
    },
];
let AuroraCardEditor = class AuroraCardEditor extends LitElement {
    constructor() {
        super(...arguments);
        this._activeCategory = 'all';
        this._moduleSubTab = 'my_modules';
        this._moduleSearchFilter = '';
        // Phase 2: Searchable Entity Picker Modal State
        this._pickerOpen = false;
        this._pickerTarget = { type: 'main' };
        this._pickerSearchQuery = '';
        this._pickerDomainFilter = 'all';
        // Phase 3: Module Studio, Creator & Import State
        this._installedModules = [...DEFAULT_INSTALLED_MODULES];
        this._expandedModules = {};
        this._moduleInnerAccordions = {
            backdrop_image: true,
            backdrop_layout: true,
            backdrop_appearance: true,
            backdrop_overlay: false,
            multi_sec_1: false,
            multi_sec_2: false,
            multi_sec_3: false,
            multi_sec_4: false,
            cond_default: false,
            cond_list: false,
        };
        this._creatorOpen = false;
        this._importYamlOpen = false;
        this._importYamlText = '';
        this._statusToast = '';
        // Module Creator Form State (Matching Screenshots 3, 4, 5)
        this._creatorDraft = {
            id: 'my_module',
            name: 'My Module',
            version: '1.0',
            creator: '',
            description: '',
            supportedCards: ['button', 'climate', 'cover', 'media-player', 'pop-up', 'separator', 'sub-buttons'],
            allCards: true,
            codeTemplate: '',
            editorSchemaYaml: '',
            suggestionRulesYaml: '',
            computedSuggestionsJs: '',
            yamlExample: '',
        };
        this._creatorPreviewMode = false;
        this._creatorPreviewEntity = '';
        this._creatorSections = {
            supported_cards: true,
            description: false,
            code_template: true,
            editor_schema: true,
            entity_suggestions: true,
            export_module: true,
        };
        this._openSections = {
            card_settings: true,
            tap_icon: false,
            tap_card: false,
            hold_card: false,
            sub_buttons: false,
            sub_top: true,
            sub_bottom: false,
            styling: false,
            style_layout: true,
            style_custom: false,
            modules: false,
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this._loadStoredCustomModules();
    }
    _loadStoredCustomModules() {
        try {
            const raw = localStorage.getItem('aurora_custom_modules_v1');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const existingIds = new Set(DEFAULT_INSTALLED_MODULES.map((m) => m.id));
                    const merged = [
                        ...DEFAULT_INSTALLED_MODULES,
                        ...parsed.filter((m) => !existingIds.has(m.id)),
                    ];
                    this._installedModules = merged;
                }
            }
        }
        catch (_e) {
            // Ignore storage access errors in restricted webviews
        }
    }
    _persistCustomModules() {
        try {
            const customOnly = this._installedModules.filter((m) => !m.builtIn);
            localStorage.setItem('aurora_custom_modules_v1', JSON.stringify(customOnly));
        }
        catch (_e) {
            // Ignore storage errors
        }
    }
    setConfig(config) {
        this._config = {
            card_type: 'button',
            button_type: 'switch',
            scrolling_effect: true,
            show_icon: true,
            prioritise_icon: false,
            show_name: true,
            state_content: ['state', 'preset_mode', 'hvac_action'],
            active_modules: [],
            global_modules: [],
            module_configs: {},
            ...config,
        };
        if (!this._creatorPreviewEntity && config.entity) {
            this._creatorPreviewEntity = config.entity;
        }
    }
    _showToast(msg) {
        this._statusToast = msg;
        setTimeout(() => {
            this._statusToast = '';
        }, 2800);
    }
    _toggleSection(key) {
        const current = Boolean(this._openSections[key]);
        this._openSections = {
            ...this._openSections,
            [key]: !current,
        };
    }
    _toggleModuleAccordion(modId) {
        const current = Boolean(this._expandedModules[modId]);
        this._expandedModules = {
            ...this._expandedModules,
            [modId]: !current,
        };
    }
    _toggleModuleInner(key) {
        const current = Boolean(this._moduleInnerAccordions[key]);
        this._moduleInnerAccordions = {
            ...this._moduleInnerAccordions,
            [key]: !current,
        };
    }
    _toggleCreatorSection(key) {
        const current = Boolean(this._creatorSections[key]);
        this._creatorSections = {
            ...this._creatorSections,
            [key]: !current,
        };
    }
    _openEntityPicker(target) {
        this._pickerTarget = target;
        this._pickerSearchQuery = '';
        this._pickerDomainFilter = 'all';
        this._pickerOpen = true;
    }
    _closeEntityPicker() {
        this._pickerOpen = false;
    }
    _getCurrentTargetEntity() {
        if (!this._config)
            return '';
        if (this._pickerTarget.type === 'main') {
            return this._config.entity ?? '';
        }
        if (this._pickerTarget.type === 'sub') {
            const subList = this._config.sub_button ?? [];
            const targetSub = subList[this._pickerTarget.index];
            return targetSub?.entity ?? '';
        }
        if (this._pickerTarget.type === 'module_field') {
            return String(this._getModuleFieldVal(this._pickerTarget.moduleId, this._pickerTarget.fieldKey, ''));
        }
        if (this._pickerTarget.type === 'creator_preview') {
            return this._creatorPreviewEntity;
        }
        return '';
    }
    _selectEntityFromModal(entityId) {
        if (!this._config)
            return;
        if (this._pickerTarget.type === 'main') {
            this._setDirectValue('entity', entityId);
        }
        else if (this._pickerTarget.type === 'sub') {
            this._updateSubButton(this._pickerTarget.index, 'entity', entityId);
        }
        else if (this._pickerTarget.type === 'module_field') {
            this._setModuleFieldVal(this._pickerTarget.moduleId, this._pickerTarget.fieldKey, entityId);
        }
        else if (this._pickerTarget.type === 'creator_preview') {
            this._creatorPreviewEntity = entityId;
        }
        this._pickerOpen = false;
    }
    _getEntityFriendlyName(entityId) {
        if (!entityId)
            return 'Select an entity';
        if (!this.hass || !this.hass.states[entityId])
            return entityId;
        const friendly = this.hass.states[entityId].attributes.friendly_name;
        return friendly ? String(friendly) : entityId;
    }
    _getEntitySecondary(entityId) {
        if (!entityId)
            return 'Tap to search entities';
        if (this.hass && this.hass.states[entityId]) {
            const attrs = this.hass.states[entityId].attributes;
            if (attrs.area_name)
                return String(attrs.area_name);
            if (attrs.device_class) {
                const dc = String(attrs.device_class).replace(/_/g, ' ');
                return dc.charAt(0).toUpperCase() + dc.slice(1) + ' • ' + entityId;
            }
        }
        return entityId;
    }
    _getEntityDomainBadge(entityId) {
        if (!entityId)
            return '';
        const domain = entityId.split('.')[0] ?? '';
        const formatted = domain.replace(/_/g, ' ');
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    _getEntityIcon(entityId) {
        if (!entityId || !this.hass || !this.hass.states[entityId]) {
            return 'mdi:help-circle-outline';
        }
        const stateObj = this.hass.states[entityId];
        const attrIcon = stateObj.attributes.icon;
        if (attrIcon)
            return String(attrIcon);
        const domain = entityId.split('.')[0];
        const deviceClass = stateObj.attributes.device_class;
        if (domain === 'sensor') {
            if (deviceClass === 'temperature')
                return 'mdi:thermometer';
            if (deviceClass === 'humidity')
                return 'mdi:water-percent';
            if (deviceClass === 'power' || deviceClass === 'energy')
                return 'mdi:flash';
            if (deviceClass === 'battery')
                return 'mdi:battery';
            return 'mdi:eye-outline';
        }
        const domainIcons = {
            light: 'mdi:lightbulb',
            switch: 'mdi:toggle-switch',
            climate: 'mdi:thermostat',
            binary_sensor: 'mdi:radiobox-marked',
            media_player: 'mdi:cast-audio',
            remote: 'mdi:remote',
            cover: 'mdi:window-shutter',
            fan: 'mdi:fan',
            lock: 'mdi:lock',
            camera: 'mdi:video',
            weather: 'mdi:weather-partly-cloudy',
            update: 'mdi:package-up',
            select: 'mdi:format-list-bulleted',
            input_select: 'mdi:tune-vertical',
            input_number: 'mdi:thermometer-lines',
            input_boolean: 'mdi:toggle-switch-outline',
            person: 'mdi:account',
            scene: 'mdi:palette-outline',
            script: 'mdi:script-text-outline',
            automation: 'mdi:robot',
        };
        return domainIcons[domain] ? domainIcons[domain] : 'mdi:bookmark-outline';
    }
    _getModalFilteredEntities() {
        if (!this.hass || !this.hass.states)
            return [];
        const all = Object.keys(this.hass.states).sort((a, b) => {
            const nameA = this._getEntityFriendlyName(a).toLowerCase();
            const nameB = this._getEntityFriendlyName(b).toLowerCase();
            return nameA.localeCompare(nameB);
        });
        const q = this._pickerSearchQuery.trim().toLowerCase();
        const domFilter = this._pickerDomainFilter;
        return all.filter((ent) => {
            const domain = ent.split('.')[0];
            if (domFilter !== 'all' && domain !== domFilter) {
                return false;
            }
            if (!q)
                return true;
            const friendly = this._getEntityFriendlyName(ent).toLowerCase();
            const domainLabel = this._getEntityDomainBadge(ent).toLowerCase();
            return (ent.toLowerCase().includes(q) ||
                friendly.includes(q) ||
                domainLabel.includes(q));
        });
    }
    // Phase 3 Helper Methods for Module Compatibility & Config
    _isModuleCompatible(mod) {
        if (mod.allCards)
            return true;
        const currentCardType = this._config?.card_type ?? 'button';
        return mod.supportedCards.includes(currentCardType);
    }
    _isModuleAppliedToThisCard(modId) {
        const list = this._config?.active_modules ?? [];
        return list.includes(modId);
    }
    _isModuleAppliedToAllCards(modId) {
        const list = this._config?.global_modules ?? [];
        return list.includes(modId);
    }
    _toggleModuleApplyThisCard(modId) {
        const current = [...(this._config?.active_modules ?? [])];
        const next = current.includes(modId)
            ? current.filter((id) => id !== modId)
            : [...current, modId];
        this._setDirectValue('active_modules', next);
    }
    _toggleModuleApplyAllCards(modId) {
        const current = [...(this._config?.global_modules ?? [])];
        const next = current.includes(modId)
            ? current.filter((id) => id !== modId)
            : [...current, modId];
        this._setDirectValue('global_modules', next);
    }
    _getModuleFieldVal(modId, key, fallback) {
        const allConfigs = this._config?.module_configs ?? {};
        const modCfg = allConfigs[modId] ?? {};
        return modCfg[key] !== undefined ? modCfg[key] : fallback;
    }
    _setModuleFieldVal(modId, key, val) {
        if (!this._config)
            return;
        const allConfigs = { ...(this._config.module_configs ?? {}) };
        const modCfg = { ...(allConfigs[modId] ?? {}), [key]: val };
        allConfigs[modId] = modCfg;
        this._setDirectValue('module_configs', allConfigs);
    }
    _openNewModuleCreator() {
        this._creatorDraft = {
            id: 'my_module',
            name: 'My Module',
            version: '1.0',
            creator: 'Przemysław',
            description: 'Custom style and behavior extension for Aurora Card.',
            supportedCards: [
                'button',
                'calendar',
                'climate',
                'cover',
                'horizontal-buttons-stack',
                'media-player',
                'pop-up',
                'select',
                'separator',
                'sub-buttons',
            ],
            allCards: true,
            codeTemplate: '/* Access card state via ${state} or ${entity} */\n.aurora-card {\n  \n}',
            editorSchemaYaml: '# Define visual editor inputs for this module:\naccent_override:\n  name: Accent Override\n  type: string',
            suggestionRulesYaml: 'domain: climate\nname_includes: heater',
            computedSuggestionsJs: 'return Object.keys(hass.states).filter(id => id.startsWith("climate."));',
            yamlExample: 'my_module:\n  accent_override: "#38bdf8"',
        };
        this._creatorOpen = true;
    }
    _openEditModuleInCreator(mod) {
        this._creatorDraft = {
            ...mod,
            supportedCards: [...mod.supportedCards],
        };
        this._creatorOpen = true;
    }
    _deleteInstalledModule(modId) {
        this._installedModules = this._installedModules.filter((m) => m.id !== modId);
        this._persistCustomModules();
        this._showToast('Module removed.');
    }
    _saveCreatorModule() {
        const cleanId = this._creatorDraft.id.trim().replace(/\s+/g, '_').toLowerCase();
        if (!cleanId)
            return;
        const savedMod = {
            ...this._creatorDraft,
            id: cleanId,
            yamlExample: this._creatorDraft.yamlExample ||
                cleanId + ':\n  enabled: true\n  version: "' + this._creatorDraft.version + '"',
        };
        const existingIdx = this._installedModules.findIndex((m) => m.id === cleanId);
        if (existingIdx >= 0) {
            const updated = [...this._installedModules];
            updated[existingIdx] = savedMod;
            this._installedModules = updated;
        }
        else {
            this._installedModules = [savedMod, ...this._installedModules];
        }
        this._persistCustomModules();
        this._creatorOpen = false;
        this._expandedModules = { ...this._expandedModules, [cleanId]: true };
        this._showToast('Module "' + savedMod.name + '" saved!');
    }
    _buildModuleExportYaml(mod) {
        const lines = [
            '# Aurora Card Module Definition',
            'id: ' + mod.id,
            'name: "' + mod.name + '"',
            'version: "' + mod.version + '"',
            'creator: "' + mod.creator + '"',
            'supported_cards: [' + (mod.allCards ? 'all' : mod.supportedCards.join(', ')) + ']',
            'description: |',
            '  ' + (mod.description || 'Custom Aurora module'),
            'code: |',
            ...mod.codeTemplate.split('\n').map((l) => '  ' + l),
        ];
        if (mod.editorSchemaYaml) {
            lines.push('schema: |');
            lines.push(...mod.editorSchemaYaml.split('\n').map((l) => '  ' + l));
        }
        return lines.join('\n');
    }
    _copyModuleYaml(forGithub) {
        const yamlStr = this._buildModuleExportYaml(this._creatorDraft);
        const payload = forGithub
            ? '### ' +
                this._creatorDraft.name +
                ' (' +
                this._creatorDraft.version +
                ')\nCreated by **' +
                (this._creatorDraft.creator || 'Community') +
                '**\n\n```yaml\n' +
                yamlStr +
                '\n```'
            : yamlStr;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(payload);
        }
        this._showToast(forGithub ? 'Copied Markdown for GitHub!' : 'Copied Module YAML!');
    }
    _downloadModuleYaml() {
        const yamlStr = this._buildModuleExportYaml(this._creatorDraft);
        const blob = new Blob([yamlStr], { type: 'text/yaml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (this._creatorDraft.id || 'aurora_module') + '.yaml';
        a.click();
        URL.revokeObjectURL(url);
        this._showToast('Downloaded ' + a.download);
    }
    _handleImportYamlConfirm() {
        const raw = this._importYamlText.trim();
        if (!raw)
            return;
        const idMatch = raw.match(/^id:\s*([^\n\r]+)/m);
        const nameMatch = raw.match(/^name:\s*["']?([^"'\n\r]+)["']?/m);
        const verMatch = raw.match(/^version:\s*["']?([^"'\n\r]+)["']?/m);
        const creatorMatch = raw.match(/^creator:\s*["']?([^"'\n\r]+)["']?/m);
        const importedId = idMatch ? idMatch[1].trim() : 'imported_' + Date.now();
        const importedName = nameMatch ? nameMatch[1].trim() : 'Imported YAML Module';
        const importedVer = verMatch ? verMatch[1].trim() : 'v1.0.0';
        const importedCreator = creatorMatch ? creatorMatch[1].trim() : 'YAML Import';
        const newMod = {
            id: importedId,
            name: importedName,
            version: importedVer,
            creator: importedCreator,
            description: 'Imported from YAML configuration.',
            supportedCards: ['button', 'climate', 'media-player'],
            allCards: true,
            codeTemplate: raw,
            editorSchemaYaml: '',
            suggestionRulesYaml: '',
            computedSuggestionsJs: '',
            yamlExample: raw,
        };
        this._installedModules = [newMod, ...this._installedModules];
        this._persistCustomModules();
        this._importYamlText = '';
        this._importYamlOpen = false;
        this._expandedModules = { ...this._expandedModules, [importedId]: true };
        this._showToast('Imported "' + importedName + '"!');
    }
    _installFromStore(storeMod) {
        const exists = this._installedModules.some((m) => m.id === storeMod.id);
        if (!exists) {
            this._installedModules = [storeMod, ...this._installedModules];
            this._persistCustomModules();
        }
        this._moduleSubTab = 'my_modules';
        this._expandedModules = { ...this._expandedModules, [storeMod.id]: true };
        this._showToast('Installed "' + storeMod.name + '" to My Modules!');
    }
    render() {
        if (!this._config || !this.hass) {
            return html ``;
        }
        const showGeneral = this._activeCategory === 'all' || this._activeCategory === 'general';
        const showSubButtons = this._activeCategory === 'all' || this._activeCategory === 'subbuttons';
        const showStyles = this._activeCategory === 'all' || this._activeCategory === 'styles';
        const showModules = this._activeCategory === 'all' || this._activeCategory === 'modules';
        return html `
      <div class="aurora-editor-root">
        ${this._statusToast
            ? html `<div class="aurora-toast">${this._statusToast}</div>`
            : html ``}
        ${this._renderCategoryTabs()}
        ${showGeneral ? this._renderTopSelectors() : html ``}
        <div class="accordions-stack">
          ${showGeneral ? this._renderCardSettingsAccordion() : html ``}
          ${showGeneral ? this._renderTapIconAccordion() : html ``}
          ${showGeneral ? this._renderTapCardAccordion() : html ``}
          ${showGeneral ? this._renderHoldAccordion() : html ``}
          ${showSubButtons ? this._renderSubButtonsAccordion() : html ``}
          ${showStyles ? this._renderStylingAccordion() : html ``}
          ${showModules ? this._renderModulesAccordion() : html ``}
        </div>
        ${this._pickerOpen ? this._renderEntityPickerModal() : html ``}
      </div>
    `;
    }
    _renderEntityPickerModal() {
        const matchingEntities = this._getModalFilteredEntities();
        const visibleEntities = matchingEntities.slice(0, 100);
        const activeEntity = this._getCurrentTargetEntity();
        const domains = [
            { id: 'all', label: 'All' },
            { id: 'climate', label: 'Climate' },
            { id: 'light', label: 'Lights' },
            { id: 'switch', label: 'Switches' },
            { id: 'media_player', label: 'Media' },
            { id: 'sensor', label: 'Sensors' },
            { id: 'binary_sensor', label: 'Binary' },
            { id: 'input_select', label: 'Inputs' },
        ];
        return html `
      <div class="picker-backdrop" @click="${this._closeEntityPicker}">
        <div class="picker-sheet" @click="${(e) => e.stopPropagation()}">
          <div class="picker-handle-bar">
            <span class="sheet-grip"></span>
          </div>

          <div class="picker-header">
            <div class="picker-search-Input-wrap">
              <ha-icon icon="mdi:magnify" class="search-icon"></ha-icon>
              <input
                type="text"
                class="picker-search-input"
                placeholder="Search"
                autofocus
                .value="${this._pickerSearchQuery}"
                @input="${(e) => (this._pickerSearchQuery = e.target.value)}"
              />
              ${this._pickerSearchQuery
            ? html `
                    <button
                      class="clear-btn"
                      @click="${() => (this._pickerSearchQuery = '')}"
                    >
                      ✕
                    </button>
                  `
            : html ``}
            </div>
            <button class="modal-close-btn" @click="${this._closeEntityPicker}">
              Cancel
            </button>
          </div>

          <div class="picker-domain-bar">
            ${domains.map((dom) => html `
                <button
                  class="dom-chip"
                  ?data-active="${this._pickerDomainFilter === dom.id}"
                  @click="${() => (this._pickerDomainFilter = dom.id)}"
                >
                  ${dom.label}
                </button>
              `)}
          </div>

          <div class="picker-list">
            ${visibleEntities.map((ent) => {
            const isSelected = ent === activeEntity;
            return html `
                <div
                  class="picker-row"
                  ?data-selected="${isSelected}"
                  @click="${() => this._selectEntityFromModal(ent)}"
                >
                  <div class="picker-row-icon">
                    <ha-icon .icon="${this._getEntityIcon(ent)}"></ha-icon>
                  </div>
                  <div class="picker-row-main">
                    <span class="picker-row-title">${this._getEntityFriendlyName(ent)}</span>
                    <span class="picker-row-sub">${this._getEntitySecondary(ent)}</span>
                  </div>
                  <div class="picker-row-domain">
                    ${this._getEntityDomainBadge(ent)}
                  </div>
                </div>
              `;
        })}

            ${matchingEntities.length === 0
            ? html `
                  <div class="picker-empty">
                    No matching entities found.
                  </div>
                `
            : html ``}

            ${matchingEntities.length > 100
            ? html `
                  <div class="picker-more-hint">
                    Showing top 100 of ${matchingEntities.length} entities. Type above to refine.
                  </div>
                `
            : html ``}
          </div>
        </div>
      </div>
    `;
    }
    _renderCategoryTabs() {
        const subCount = (this._config?.sub_button ?? []).length;
        const activeModCount = (this._config?.active_modules ?? []).length +
            (this._config?.global_modules ?? []).length;
        return html `
      <div class="category-bar">
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === 'all'}"
          @click="${() => (this._activeCategory = 'all')}"
        >
          All
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === 'general'}"
          @click="${() => (this._activeCategory = 'general')}"
        >
          General
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === 'subbuttons'}"
          @click="${() => (this._activeCategory = 'subbuttons')}"
        >
          Sub-buttons (${subCount})
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === 'styles'}"
          @click="${() => (this._activeCategory = 'styles')}"
        >
          Styling
        </button>
        <button
          class="cat-pill"
          ?data-active="${this._activeCategory === 'modules'}"
          @click="${() => {
            this._activeCategory = 'modules';
            this._openSections = { ...this._openSections, modules: true };
        }}"
        >
          Modules (${activeModCount})
        </button>
      </div>
    `;
    }
    _renderTopSelectors() {
        const cardType = this._config?.card_type ?? 'button';
        const buttonType = this._config?.button_type ?? 'switch';
        const entity = this._config?.entity ?? '';
        return html `
      <div class="top-selectors">
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Card type</span>
            <select
              class="native-select"
              .value="${cardType}"
              @change="${(e) => this._valueChanged(e, 'card_type')}"
            >
              <optgroup label="Core Bubble Parity">
                <option value="button">Button (Switch, slider, ...)</option>
                <option value="pop-up">Pop-up</option>
                <option value="separator">Separator</option>
                <option value="cover">Cover</option>
                <option value="climate">Climate</option>
                <option value="media-player">Media player</option>
                <option value="empty-column">Empty column</option>
              </optgroup>
              <optgroup label="Aurora Enterprise Suite">
                <option value="routine-macro">Routine Macro Launcher</option>
                <option value="energy-flow">Energy Flow Matrix</option>
                <option value="security-matrix">Security & Camera Hub</option>
                <option value="weather-radar">Weather & Microclimate</option>
                <option value="multi-room-audio">Multi-Room Audio (MA)</option>
                <option value="hvac-zoning">HVAC & Storage Heating</option>
                <option value="mesh-topology">Zigbee / Matter Mesh</option>
                <option value="ev-charger">EV & Solar Charger</option>
                <option value="air-quality">Air Quality Matrix</option>
                <option value="floorplan">Interactive Floorplan</option>
              </optgroup>
            </select>
          </div>
          <button
            class="clear-btn"
            title="Reset to button"
            @click="${() => this._setDirectValue('card_type', 'button')}"
          >
            ✕
          </button>
        </div>

        ${cardType === 'button'
            ? html `
              <div class="ha-filled-box">
                <div class="box-content">
                  <span class="floating-label">Button type</span>
                  <select
                    class="native-select"
                    .value="${buttonType}"
                    @change="${(e) => this._valueChanged(e, 'button_type')}"
                  >
                    <option value="switch">Switch</option>
                    <option value="slider">Slider</option>
                    <option value="state">State</option>
                    <option value="name">Name / Text</option>
                  </select>
                </div>
                <button
                  class="clear-btn"
                  title="Reset"
                  @click="${() => this._setDirectValue('button_type', 'switch')}"
                >
                  ✕
                </button>
              </div>
            `
            : html ``}

        ${cardType !== 'empty-column'
            ? html `
              <div class="section-caption">Entity (toggle)</div>
              <div
                class="ha-entity-box"
                @click="${() => this._openEntityPicker({ type: 'main' })}"
              >
                <div class="entity-icon-badge">
                  <ha-icon .icon="${this._getEntityIcon(entity)}"></ha-icon>
                </div>
                <div class="entity-text-col">
                  <span class="entity-primary">${this._getEntityFriendlyName(entity)}</span>
                  <span class="entity-secondary">${this._getEntitySecondary(entity)}</span>
                </div>
                ${entity
                ? html `
                      <button
                        class="clear-btn"
                        title="Clear entity"
                        @click="${(e) => {
                    e.stopPropagation();
                    this._setDirectValue('entity', undefined);
                }}"
                      >
                        ✕
                      </button>
                    `
                : html ``}
                <span class="dropdown-caret">▼</span>
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderCardSettingsAccordion() {
        const isOpen = Boolean(this._openSections.card_settings);
        const name = this._config?.name ?? '';
        const icon = this._config?.icon ?? '';
        const scrolling = this._config?.scrolling_effect !== false;
        const showIcon = this._config?.show_icon !== false;
        const prioritiseIcon = Boolean(this._config?.prioritise_icon);
        const showName = this._config?.show_name !== false;
        const stateChips = this._config?.state_content ?? ['state'];
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('card_settings')}">
          <div class="header-left">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>Card settings</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>

        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Name</span>
                    <input
                      type="text"
                      class="native-input"
                      .value="${name}"
                      placeholder=" "
                      @input="${(e) => this._valueChanged(e, 'name')}"
                    />
                  </div>
                </div>

                <div class="ha-filled-box">
                  <div class="box-content">
                    <span class="floating-label">Optional - Icon</span>
                    <input
                      type="text"
                      class="native-input"
                      .value="${icon}"
                      placeholder="e.g. mdi:thermometer"
                      @input="${(e) => this._valueChanged(e, 'icon')}"
                    />
                  </div>
                </div>

                <div class="toggle-list">
                  ${this._renderToggleRow('Text scrolling effect', scrolling, (val) => this._setDirectValue('scrolling_effect', val))}
                  ${this._renderToggleRow('Show icon', showIcon, (val) => this._setDirectValue('show_icon', val))}
                  ${this._renderToggleRow('Prioritise icon over entity picture', prioritiseIcon, (val) => this._setDirectValue('prioritise_icon', val))}
                  ${this._renderToggleRow('Show name', showName, (val) => this._setDirectValue('show_name', val))}
                </div>

                <div class="state-content-block">
                  <span class="block-label">State content</span>
                  <div class="chips-well">
                    <div class="chips-list">
                      ${stateChips.map((chip, idx) => html `
                          <div class="ha-chip">
                            <span class="chip-drag">＝</span>
                            <span class="chip-text">${this._formatChipLabel(chip)}</span>
                            <button
                              class="chip-remove"
                              @click="${() => this._removeStateChip(idx)}"
                            >
                              ✕
                            </button>
                          </div>
                        `)}
                    </div>
                    <button class="chip-add-btn" @click="${this._addStateChip}">
                      <span>＋</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderTapIconAccordion() {
        const isOpen = Boolean(this._openSections.tap_icon);
        const currentAction = this._config?.icon_tap_action?.action ?? 'toggle';
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('tap_icon')}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <span>Tap action on icon</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                ${this._renderActionSelector('icon_tap_action', currentAction)}
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderTapCardAccordion() {
        const isOpen = Boolean(this._openSections.tap_card);
        const currentAction = this._config?.tap_action?.action ?? 'toggle';
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('tap_card')}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
            <span>Tap action on card</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                ${this._renderActionSelector('tap_action', currentAction)}
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderHoldAccordion() {
        const isOpen = Boolean(this._openSections.hold_card);
        const currentAction = this._config?.hold_action?.action ?? 'more-info';
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('hold_card')}">
          <div class="header-left">
            <ha-icon icon="mdi:gesture-tap-hold"></ha-icon>
            <span>Hold behaviour</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>
        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                ${this._renderActionSelector('hold_action', currentAction)}
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderSubButtonsAccordion() {
        const isOpen = Boolean(this._openSections.sub_buttons);
        const topOpen = Boolean(this._openSections.sub_top);
        const bottomOpen = Boolean(this._openSections.sub_bottom);
        const subButtons = this._config?.sub_button ?? [];
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('sub_buttons')}">
          <div class="header-left">
            <ha-icon icon="mdi:shape-square-plus"></ha-icon>
            <span>Sub-buttons editor</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>

        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection('sub_top')}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:arrow-up-circle-outline"></ha-icon>
                      <span>Main sub-buttons (top)</span>
                    </div>
                    <span class="chevron">${topOpen ? '▲' : '▼'}</span>
                  </div>
                  ${topOpen
                ? html `
                        <div class="ha-nested-body">
                          ${subButtons.map((sub, idx) => {
                    const subEnt = sub.entity ?? '';
                    return html `
                              <div class="sub-button-row">
                                <button
                                  type="button"
                                  class="sub-entity-picker-btn"
                                  @click="${() => this._openEntityPicker({ type: 'sub', index: idx })}"
                                >
                                  <ha-icon .icon="${this._getEntityIcon(subEnt)}"></ha-icon>
                                  <span class="sub-ent-label">
                                    ${this._getEntityFriendlyName(subEnt)}
                                  </span>
                                  <span class="dropdown-caret">▼</span>
                                </button>
                                <input
                                  type="text"
                                  class="native-input sub-icon-input"
                                  placeholder="mdi:power"
                                  .value="${sub.icon ?? ''}"
                                  @input="${(e) => this._updateSubButton(idx, 'icon', e.target.value)}"
                                />
                                <button
                                  class="danger-icon-btn"
                                  @click="${() => this._removeSubButton(idx)}"
                                >
                                  ✕
                                </button>
                              </div>
                            `;
                })}
                          <button class="chip-add-btn" @click="${this._addSubButton}">
                            <span>＋</span>
                            <span>Add sub-button</span>
                          </button>
                        </div>
                      `
                : html ``}
                </div>

                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection('sub_bottom')}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:arrow-down-circle-outline"></ha-icon>
                      <span>Bottom sub-buttons</span>
                    </div>
                    <span class="chevron">${bottomOpen ? '▲' : '▼'}</span>
                  </div>
                  ${bottomOpen
                ? html `
                        <div class="ha-nested-body">
                          <p class="muted-note">
                            Configure bottom-aligned bar sub-buttons or group stacks.
                          </p>
                          <button class="chip-add-btn" @click="${this._addSubButton}">
                            <span>＋</span>
                            <span>Add bottom sub-button</span>
                          </button>
                        </div>
                      `
                : html ``}
                </div>

                <div class="ha-info-callout">
                  <div class="callout-title">
                    <ha-icon icon="mdi:information-outline"></ha-icon>
                    <span>Sub-buttons</span>
                  </div>
                  <p>
                    This editor allows you to add customised sub-buttons to your card.
                    Sub-buttons support three types:
                  </p>
                  <ul class="callout-list">
                    <li>
                      <strong>Default (button)</strong> - Standard button with tap actions
                    </li>
                    <li>
                      <strong>Slider</strong> - Control or display numeric values (brightness,
                      volume, temperature, etc.)
                    </li>
                    <li>
                      <strong>Dropdown / Select</strong> - Dropdown menu for selectable entities
                    </li>
                  </ul>
                </div>
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderStylingAccordion() {
        const isOpen = Boolean(this._openSections.styling);
        const layoutOpen = Boolean(this._openSections.style_layout);
        const customOpen = Boolean(this._openSections.style_custom);
        const preset = this._config?.vibe_preset ?? 'aurora_lumina';
        const customStyles = this._config?.custom_styles ?? '';
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('styling')}">
          <div class="header-left">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Styling and layout options</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>

        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection('style_layout')}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:view-grid"></ha-icon>
                      <span>Layout</span>
                    </div>
                    <span class="chevron">${layoutOpen ? '▲' : '▼'}</span>
                  </div>
                  ${layoutOpen
                ? html `
                        <div class="ha-nested-body">
                          <div class="ha-filled-box">
                            <div class="box-content">
                              <span class="floating-label">Aurora Aesthetic Vibe Preset</span>
                              <select
                                class="native-select"
                                .value="${preset}"
                                @change="${(e) => this._valueChanged(e, 'vibe_preset')}"
                              >
                                <option value="aurora_lumina">Aurora Lumina (Frosted Glass)</option>
                                <option value="crimson_midnight">Crimson Midnight (Gothic Dark)</option>
                                <option value="obsidian_minimal">Obsidian Minimal</option>
                                <option value="ha_native">Home Assistant Native Surface</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      `
                : html ``}
                </div>

                <div class="ha-nested-accordion">
                  <div
                    class="ha-nested-header"
                    @click="${() => this._toggleSection('style_custom')}"
                  >
                    <div class="header-left">
                      <ha-icon icon="mdi:code-braces"></ha-icon>
                      <span>Custom styles & templates</span>
                    </div>
                    <span class="chevron">${customOpen ? '▲' : '▼'}</span>
                  </div>
                  ${customOpen
                ? html `
                        <div class="ha-nested-body">
                          <textarea
                            class="code-textarea"
                            rows="4"
                            placeholder=".aurora-card { --aurora-blur: 24px; }"
                            .value="${customStyles}"
                            @input="${(e) => this._valueChanged(e, 'custom_styles')}"
                          ></textarea>
                        </div>
                      `
                : html ``}
                </div>
              </div>
            `
            : html ``}
      </div>
    `;
    }
    // ============================================================================
    // PHASE 3: MODULES ACCORDION, MODULE STUDIO & MODULE CREATOR
    // ============================================================================
    _renderModulesAccordion() {
        const isOpen = Boolean(this._openSections.modules);
        return html `
      <div class="ha-accordion" ?data-open="${isOpen}">
        <div class="ha-accordion-header" @click="${() => this._toggleSection('modules')}">
          <div class="header-left">
            <ha-icon icon="mdi:puzzle"></ha-icon>
            <span>Modules</span>
          </div>
          <span class="chevron">${isOpen ? '▲' : '▼'}</span>
        </div>

        ${isOpen
            ? html `
              <div class="ha-accordion-body">
                <!-- Top Sub-Tabs: My Modules | Module Store (Screenshots 4, 5, 8) -->
                <div class="module-subtabs">
                  <button
                    class="mod-tab"
                    ?data-active="${this._moduleSubTab === 'my_modules'}"
                    @click="${() => {
                this._moduleSubTab = 'my_modules';
                this._creatorOpen = false;
            }}"
                  >
                    <ha-icon icon="mdi:puzzle-heart-outline"></ha-icon>
                    <span>My Modules</span>
                  </button>
                  <button
                    class="mod-tab"
                    ?data-active="${this._moduleSubTab === 'store'}"
                    @click="${() => {
                this._moduleSubTab = 'store';
                this._creatorOpen = false;
            }}"
                  >
                    <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
                    <span>Module Store</span>
                  </button>
                </div>

                ${this._creatorOpen
                ? this._renderModuleCreatorStudio()
                : this._moduleSubTab === 'my_modules'
                    ? this._renderMyModulesView()
                    : this._renderModuleStoreView()}
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderMyModulesView() {
        const enableUnsupported = Boolean(this._config?.enable_unsupported_modules);
        const query = this._moduleSearchFilter.trim().toLowerCase();
        const filteredModules = this._installedModules.filter((mod) => {
            const compatible = this._isModuleCompatible(mod);
            if (!enableUnsupported && !compatible) {
                return false;
            }
            if (!query)
                return true;
            return (mod.name.toLowerCase().includes(query) ||
                mod.id.toLowerCase().includes(query) ||
                mod.description.toLowerCase().includes(query));
        });
        return html `
      <!-- Search Bar & Sort Row (Screenshot 8) -->
      <div class="module-search-row">
        <div class="module-search-bar">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search modules"
            .value="${this._moduleSearchFilter}"
            @input="${(e) => (this._moduleSearchFilter = e.target.value)}"
          />
        </div>
        <button
          class="sort-icon-btn"
          title="Sort compatible first"
          @click="${() => {
            this._installedModules = [...this._installedModules].reverse();
        }}"
        >
          <ha-icon icon="mdi:sort"></ha-icon>
        </button>
      </div>

      ${this._renderToggleRow('Enable unsupported modules', enableUnsupported, (val) => this._setDirectValue('enable_unsupported_modules', val))}

      <!-- Installed Modules Accordion List (Screenshots 6, 7, 11, 12) -->
      <div class="modules-accordion-list">
        ${filteredModules.map((mod) => this._renderSingleInstalledModule(mod))}
      </div>

      <!-- Create New Module & Import From YAML Action Pills (Screenshot 6, 11) -->
      <div class="module-action-pills-row">
        <button class="teal-action-pill" @click="${this._openNewModuleCreator}">
          <ha-icon icon="mdi:puzzle-plus"></ha-icon>
          <span>Create new Module</span>
        </button>
        <button
          class="teal-action-pill"
          @click="${() => (this._importYamlOpen = !this._importYamlOpen)}"
        >
          <ha-icon icon="mdi:code-braces"></ha-icon>
          <span>Import from YAML</span>
        </button>
      </div>

      ${this._importYamlOpen
            ? html `
            <div class="import-yaml-drawer">
              <span class="block-label">Paste Module YAML</span>
              <textarea
                class="code-textarea"
                rows="6"
                placeholder="id: custom_glow\nname: Custom Glow\nversion: 1.0\ncode: |\n  .aurora-card { box-shadow: 0 0 18px #38bdf8; }"
                .value="${this._importYamlText}"
                @input="${(e) => (this._importYamlText = e.target.value)}"
              ></textarea>
              <div class="creator-bottom-actions">
                <button
                  class="teal-action-pill secondary-pill"
                  @click="${() => (this._importYamlOpen = false)}"
                >
                  ✕ Cancel
                </button>
                <button class="teal-action-pill" @click="${this._handleImportYamlConfirm}">
                  ＋ Import Module
                </button>
              </div>
            </div>
          `
            : html ``}

      <!-- Informational Callout Box (Screenshot 6, 11) -->
      <div class="ha-info-callout">
        <div class="callout-title">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>Modules</span>
        </div>
        <p>
          Modules are really powerful and the best way to apply
          <u>custom styles</u> and/or <u>JS templates</u> to your cards, without having to
          copy/paste the same code over and over again.
        </p>
        <p>
          This makes it easy to change things like the styles of all your cards, and for
          advanced users, to modify or add features with a real editor.
        </p>
        <p>
          <strong>If coding isn't your thing</strong>, you can also find and install modules
          made by the community in the <strong>Module Store</strong>.
        </p>
      </div>
    `;
    }
    _renderSingleInstalledModule(mod) {
        const isExpanded = Boolean(this._expandedModules[mod.id]);
        const isCompatible = this._isModuleCompatible(mod);
        const appliedThis = this._isModuleAppliedToThisCard(mod.id);
        const appliedAll = this._isModuleAppliedToAllCards(mod.id);
        const isActive = appliedThis || appliedAll;
        return html `
      <div
        class="module-item-accordion"
        ?data-compatible="${isCompatible}"
        ?data-active="${isActive}"
        ?data-expanded="${isExpanded}"
      >
        <div
          class="module-item-header"
          @click="${() => this._toggleModuleAccordion(mod.id)}"
        >
          <div class="header-left">
            <ha-icon
              .icon="${isActive ? 'mdi:puzzle-check-outline' : 'mdi:puzzle-outline'}"
              class="mod-puzzle-icon"
            ></ha-icon>
            <span class="mod-item-title">${mod.name}</span>
            ${!isCompatible
            ? html `<span class="unsupported-tag">Unsupported</span>`
            : html ``}
          </div>
          <span class="chevron">${isExpanded ? '▲' : '▼'}</span>
        </div>

        ${isExpanded
            ? html `
              <div class="module-item-body">
                <!-- APPLY TO Bar + Edit/Delete Controls (Screenshots 7, 11, 12) -->
                <div class="apply-to-section">
                  <span class="apply-to-caption">APPLY TO</span>
                  <div class="apply-to-bar">
                    <div class="apply-pills-left">
                      <button
                        type="button"
                        class="apply-pill"
                        ?data-selected="${appliedThis}"
                        @click="${() => this._toggleModuleApplyThisCard(mod.id)}"
                      >
                        <ha-icon icon="mdi:card-text-outline"></ha-icon>
                        <span>This card</span>
                      </button>
                      <button
                        type="button"
                        class="apply-pill"
                        ?data-selected="${appliedAll}"
                        @click="${() => this._toggleModuleApplyAllCards(mod.id)}"
                      >
                        <ha-icon icon="mdi:cards-outline"></ha-icon>
                        <span>All cards</span>
                      </button>
                      <button
                        type="button"
                        class="circle-help-btn"
                        title="Module compatibility & scope info"
                      >
                        ?
                      </button>
                    </div>
                    <div class="apply-actions-right">
                      <button
                        type="button"
                        class="icon-tool-btn"
                        title="Edit module in Module Studio"
                        @click="${() => this._openEditModuleInCreator(mod)}"
                      >
                        <ha-icon icon="mdi:pencil"></ha-icon>
                      </button>
                      <button
                        type="button"
                        class="icon-tool-btn"
                        title="Delete module"
                        @click="${() => this._deleteInstalledModule(mod.id)}"
                      >
                        <ha-icon icon="mdi:delete"></ha-icon>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Module Configuration Header (Screenshots 7, 11, 12) -->
                <div class="mod-config-title-row">
                  <ha-icon icon="mdi:cog"></ha-icon>
                  <span>Configuration</span>
                </div>

                <!-- Specialized or Generic Module Configuration Controls -->
                ${this._renderModuleSpecificControls(mod)}

                <!-- About this module Box with YAML Example & Version Badge (Screenshots 7, 11, 12) -->
                <div class="ha-info-callout mod-about-box">
                  <div class="callout-title">
                    <ha-icon icon="mdi:information-outline"></ha-icon>
                    <span>About this module</span>
                  </div>
                  <p>${mod.description}</p>
                  <pre class="yaml-code-preview"><code>${mod.yamlExample}</code></pre>
                  <div class="mod-about-footer">
                    <span class="mod-creator-credit">Created by ${mod.creator}</span>
                    <span class="mod-version-badge">Module info • ${mod.version}</span>
                  </div>
                </div>
              </div>
            `
            : html ``}
      </div>
    `;
    }
    _renderModuleSpecificControls(mod) {
        // 1. Card Backdrop Image (Screenshot 12)
        if (mod.id === 'card_backdrop_image') {
            const imgOpen = Boolean(this._moduleInnerAccordions.backdrop_image);
            const layoutOpen = Boolean(this._moduleInnerAccordions.backdrop_layout);
            const appOpen = Boolean(this._moduleInnerAccordions.backdrop_appearance);
            const ovOpen = Boolean(this._moduleInnerAccordions.backdrop_overlay);
            const imageUrl = String(this._getModuleFieldVal(mod.id, 'image_url', ''));
            const imgSize = String(this._getModuleFieldVal(mod.id, 'size', 'cover'));
            const imgRepeat = String(this._getModuleFieldVal(mod.id, 'repeat', 'no-repeat'));
            const customPos = Boolean(this._getModuleFieldVal(mod.id, 'custom_position', false));
            const posX = Number(this._getModuleFieldVal(mod.id, 'pos_x', 50));
            const posY = Number(this._getModuleFieldVal(mod.id, 'pos_y', 50));
            const opacity = Number(this._getModuleFieldVal(mod.id, 'image_opacity', 100));
            const blur = Number(this._getModuleFieldVal(mod.id, 'blur', 0));
            const scale = Number(this._getModuleFieldVal(mod.id, 'scale', 100));
            return html `
        <div class="mod-controls-stack">
          <!-- Image Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('backdrop_image')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:image-outline"></ha-icon>
                <span>Image</span>
              </div>
              <span class="chevron">${imgOpen ? '▲' : '▼'}</span>
            </div>
            ${imgOpen
                ? html `
                  <div class="ha-nested-body">
                    <span class="floating-label">Background image</span>
                    <div class="media-dropzone">
                      <button
                        type="button"
                        class="media-pick-btn"
                        @click="${() => this._setModuleFieldVal(mod.id, 'image_url', '/local/aurora_backdrop.jpg')}"
                      >
                        <ha-icon icon="mdi:image-plus"></ha-icon>
                        <span>Pick media</span>
                      </button>
                      <span class="muted-note">
                        Drop file here or click to choose from Media Browser
                      </span>
                    </div>
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Direct Image URL</span>
                        <input
                          type="text"
                          class="native-input"
                          placeholder="/local/bg.jpg or https://..."
                          .value="${imageUrl}"
                          @input="${(e) => this._setModuleFieldVal(mod.id, 'image_url', e.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                `
                : html ``}
          </div>

          <!-- Image Layout Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('backdrop_layout')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:crop-free"></ha-icon>
                <span>Image layout</span>
              </div>
              <span class="chevron">${layoutOpen ? '▲' : '▼'}</span>
            </div>
            ${layoutOpen
                ? html `
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Size</span>
                        <select
                          class="native-select"
                          .value="${imgSize}"
                          @change="${(e) => this._setModuleFieldVal(mod.id, 'size', e.target.value)}"
                        >
                          <option value="cover">Cover</option>
                          <option value="contain">Contain</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>

                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Repeat</span>
                        <select
                          class="native-select"
                          .value="${imgRepeat}"
                          @change="${(e) => this._setModuleFieldVal(mod.id, 'repeat', e.target.value)}"
                        >
                          <option value="no-repeat">No repeat</option>
                          <option value="repeat">Repeat</option>
                        </select>
                      </div>
                    </div>

                    ${this._renderToggleRow('Use custom position', customPos, (val) => this._setModuleFieldVal(mod.id, 'custom_position', val))}

                    ${this._renderSliderControl('Horizontal position', posX, 0, 100, (val) => this._setModuleFieldVal(mod.id, 'pos_x', val))}${this._renderSliderControl('Vertical position', posY, 0, 100, (val) => this._setModuleFieldVal(mod.id, 'pos_y', val))}
                  </div>
                `
                : html ``}
          </div>

          <!-- Appearance Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('backdrop_appearance')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:tune"></ha-icon>
                <span>Appearance</span>
              </div>
              <span class="chevron">${appOpen ? '▲' : '▼'}</span>
            </div>
            ${appOpen
                ? html `
                  <div class="ha-nested-body">
                    ${this._renderSliderControl('Image opacity', opacity, 0, 100, (val) => this._setModuleFieldVal(mod.id, 'image_opacity', val))}
                    ${this._renderSliderControl('Background blur', blur, 0, 30, (val) => this._setModuleFieldVal(mod.id, 'blur', val))}${this._renderSliderControl('Image scale', scale, 50, 200, (val) => this._setModuleFieldVal(mod.id, 'scale', val))}
                  </div>
                `
                : html ``}
          </div>

          <!-- Overlay Sub-Accordion -->
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('backdrop_overlay')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:layers-outline"></ha-icon>
                <span>Overlay</span>
              </div>
              <span class="chevron">${ovOpen ? '▲' : '▼'}</span>
            </div>
            ${ovOpen
                ? html `
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Overlay Hex Color</span>
                        <input
                          type="text"
                          class="native-input"
                          .value="${String(this._getModuleFieldVal(mod.id, 'overlay_color', '#000000'))}"
                          @input="${(e) => this._setModuleFieldVal(mod.id, 'overlay_color', e.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                `
                : html ``}
          </div>
        </div>
      `;
        }
        // 2. Multi Section Card (Screenshots 7 & 12)
        if (mod.id === 'multi_section_card') {
            const sectionCount = String(this._getModuleFieldVal(mod.id, 'section_count', '4'));
            const hideDefault = Boolean(this._getModuleFieldVal(mod.id, 'hide_default_content', true));
            const bgColor = String(this._getModuleFieldVal(mod.id, 'bg_color', ''));
            const sections = [1, 2, 3, 4];
            return html `
        <div class="mod-controls-stack">
          <div class="ha-filled-box">
            <div class="box-content">
              <span class="floating-label">Section count</span>
              <select
                class="native-select"
                .value="${sectionCount}"
                @change="${(e) => this._setModuleFieldVal(mod.id, 'section_count', e.target.value)}"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          ${sections.map((num) => {
                const secKey = 'multi_sec_' + num;
                const isOpen = Boolean(this._moduleInnerAccordions[secKey]);
                const entField = 'entity_' + num;
                const iconField = 'icon_' + num;
                const entVal = String(this._getModuleFieldVal(mod.id, entField, ''));
                const iconVal = String(this._getModuleFieldVal(mod.id, iconField, ''));
                return html `
              <div class="ha-nested-accordion">
                <div
                  class="ha-nested-header"
                  @click="${() => this._toggleModuleInner(secKey)}"
                >
                  <div class="header-left">
                    <span class="num-circle-badge">${num}</span>
                    <span>Section ${num}</span>
                  </div>
                  <span class="chevron">${isOpen ? '▲' : '▼'}</span>
                </div>
                ${isOpen
                    ? html `
                      <div class="ha-nested-body">
                        <div
                          class="ha-entity-box"
                          @click="${() => this._openEntityPicker({
                        type: 'module_field',
                        moduleId: mod.id,
                        fieldKey: entField,
                    })}"
                        >
                          <div class="entity-icon-badge">
                            <ha-icon .icon="${this._getEntityIcon(entVal)}"></ha-icon>
                          </div>
                          <div class="entity-text-col">
                            <span class="entity-primary">
                              ${this._getEntityFriendlyName(entVal)}
                            </span>
                            <span class="entity-secondary">
                              ${this._getEntitySecondary(entVal)}
                            </span>
                          </div>
                          <span class="dropdown-caret">▼</span>
                        </div>

                        <div class="ha-filled-box">
                          <div class="box-content">
                            <span class="floating-label">Section ${num} Icon</span>
                            <input
                              type="text"
                              class="native-input"
                              placeholder="mdi:thermometer"
                              .value="${iconVal}"
                              @input="${(e) => this._setModuleFieldVal(mod.id, iconField, e.target.value)}"
                            />
                          </div>
                        </div>
                      </div>
                    `
                    : html ``}
              </div>
            `;
            })}

          ${this._renderToggleRow('Hide default card content', hideDefault, (val) => this._setModuleFieldVal(mod.id, 'hide_default_content', val))}

          <div class="ha-filled-box">
            <div class="box-content">
              <span class="floating-label">Card Background Color (name, hex, or rgb)</span>
              <input
                type="text"
                class="native-input"
                placeholder="e.g. #ff5733 or accent"
                .value="${bgColor}"
                @input="${(e) => this._setModuleFieldVal(mod.id, 'bg_color', e.target.value)}"
              />
            </div>
          </div>
          <span class="field-caption-note">
            Accepts: color name (red, blue), hex (#ff5733), rgb(255,87,51), or HA theme color
            name (accent, primary)
          </span>
        </div>
      `;
        }
        // 3. Conditional slider button coloring (Screenshot 11)
        if (mod.id === 'conditional_slider_coloring') {
            const defOpen = Boolean(this._moduleInnerAccordions.cond_default);
            const listOpen = Boolean(this._moduleInnerAccordions.cond_list);
            return html `
        <div class="mod-controls-stack">
          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('cond_default')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:palette-outline"></ha-icon>
                <span>Default slider color</span>
              </div>
              <span class="chevron">${defOpen ? '▲' : '▼'}</span>
            </div>
            ${defOpen
                ? html `
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Default CSS Color</span>
                        <input
                          type="text"
                          class="native-input"
                          .value="${String(this._getModuleFieldVal(mod.id, 'default_color', 'var(--primary-color)'))}"
                          @input="${(e) => this._setModuleFieldVal(mod.id, 'default_color', e.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                `
                : html ``}
          </div>

          <div class="ha-nested-accordion">
            <div
              class="ha-nested-header"
              @click="${() => this._toggleModuleInner('cond_list')}"
            >
              <div class="header-left">
                <ha-icon icon="mdi:format-list-checks"></ha-icon>
                <span>Conditions list</span>
              </div>
              <span class="chevron">${listOpen ? '▲' : '▼'}</span>
            </div>
            ${listOpen
                ? html `
                  <div class="ha-nested-body">
                    <div class="ha-filled-box">
                      <div class="box-content">
                        <span class="floating-label">Threshold Color Override</span>
                        <input
                          type="text"
                          class="native-input"
                          placeholder="#ef4444 when > 22"
                          .value="${String(this._getModuleFieldVal(mod.id, 'condition_rule', ''))}"
                          @input="${(e) => this._setModuleFieldVal(mod.id, 'condition_rule', e.target.value)}"
                        />
                      </div>
                    </div>
                  </div>
                `
                : html ``}
          </div>
        </div>
      `;
        }
        // Default Generic Parameter Input for Custom/Other Modules
        const customParam = String(this._getModuleFieldVal(mod.id, 'custom_param', ''));
        return html `
      <div class="mod-controls-stack">
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module Custom Parameter / Override</span>
            <input
              type="text"
              class="native-input"
              placeholder="Enter value or CSS token..."
              .value="${customParam}"
              @input="${(e) => this._setModuleFieldVal(mod.id, 'custom_param', e.target.value)}"
            />
          </div>
        </div>
      </div>
    `;
    }
    _renderSliderControl(label, val, min, max, onChange) {
        return html `
      <div class="slider-control-block">
        <span class="slider-label">${label}</span>
        <div class="slider-input-row">
          <input
            type="range"
            class="ha-range-slider"
            min="${min}"
            max="${max}"
            .value="${String(val)}"
            @input="${(e) => onChange(Number(e.target.value))}"
          />
          <input
            type="number"
            class="slider-num-box"
            min="${min}"
            max="${max}"
            .value="${String(val)}"
            @input="${(e) => onChange(Number(e.target.value))}"
          />
        </div>
      </div>
    `;
    }
    // ============================================================================
    // PHASE 3: CREATE NEW MODULE STUDIO (Screenshots 3, 4, 5)
    // ============================================================================
    _renderModuleCreatorStudio() {
        const draft = this._creatorDraft;
        const supOpen = Boolean(this._creatorSections.supported_cards);
        const descOpen = Boolean(this._creatorSections.description);
        const codeOpen = Boolean(this._creatorSections.code_template);
        const schemaOpen = Boolean(this._creatorSections.editor_schema);
        const sugOpen = Boolean(this._creatorSections.entity_suggestions);
        const expOpen = Boolean(this._creatorSections.export_module);
        return html `
      <div class="creator-studio-container">
        <div class="creator-title-row">
          <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
          <span>Create new Module</span>
        </div>

        <!-- Module ID -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module ID</span>
            <input
              type="text"
              class="native-input"
              .value="${draft.id}"
              @input="${(e) => {
            this._creatorDraft = {
                ...this._creatorDraft,
                id: e.target.value,
            };
        }}"
            />
          </div>
        </div>
        <span class="field-caption-note">
          Must be unique and cannot be changed after the Module is created.
        </span>

        <!-- Module Name -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Module Name</span>
            <input
              type="text"
              class="native-input"
              .value="${draft.name}"
              @input="${(e) => {
            this._creatorDraft = {
                ...this._creatorDraft,
                name: e.target.value,
            };
        }}"
            />
          </div>
        </div>

        <!-- Version -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Version</span>
            <input
              type="text"
              class="native-input"
              .value="${draft.version}"
              @input="${(e) => {
            this._creatorDraft = {
                ...this._creatorDraft,
                version: e.target.value,
            };
        }}"
            />
          </div>
        </div>

        <!-- Creator -->
        <div class="ha-filled-box">
          <div class="box-content">
            <span class="floating-label">Creator</span>
            <input
              type="text"
              class="native-input"
              placeholder="Your name or handle"
              .value="${draft.creator}"
              @input="${(e) => {
            this._creatorDraft = {
                ...this._creatorDraft,
                creator: e.target.value,
            };
        }}"
            />
          </div>
        </div>

        <!-- 1. Supported Cards Accordion (Screenshots 4 & 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('supported_cards')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:filter-check-outline"></ha-icon>
              <span>Supported cards</span>
            </div>
            <span class="chevron">${supOpen ? '▲' : '▼'}</span>
          </div>
          ${supOpen
            ? html `
                <div class="creator-sub-body">
                  <label class="ha-checkbox-item master-checkbox">
                    <input
                      type="checkbox"
                      .checked="${draft.allCards}"
                      @change="${(e) => {
                const checked = e.target.checked;
                this._creatorDraft = {
                    ...this._creatorDraft,
                    allCards: checked,
                    supportedCards: checked
                        ? SUPPORTED_CARD_TYPES.map((c) => c.id)
                        : [],
                };
            }}"
                    />
                    <span>All cards</span>
                  </label>

                  <div class="checkbox-two-col-grid">
                    ${SUPPORTED_CARD_TYPES.map((cardItem) => {
                const isChecked = draft.allCards || draft.supportedCards.includes(cardItem.id);
                return html `
                        <label class="ha-checkbox-item">
                          <input
                            type="checkbox"
                            .checked="${isChecked}"
                            @change="${(e) => {
                    const checked = e.target.checked;
                    const current = new Set(this._creatorDraft.supportedCards);
                    if (checked) {
                        current.add(cardItem.id);
                    }
                    else {
                        current.delete(cardItem.id);
                    }
                    this._creatorDraft = {
                        ...this._creatorDraft,
                        allCards: current.size === SUPPORTED_CARD_TYPES.length,
                        supportedCards: Array.from(current),
                    };
                }}"
                          />
                          <span>${cardItem.label}</span>
                        </label>
                      `;
            })}
                  </div>
                  <span class="field-caption-note">
                    Select the card types that this module supports.
                  </span>
                </div>
              `
            : html ``}
        </div>

        <!-- 2. Description Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('description')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:file-document-outline"></ha-icon>
              <span>Description</span>
            </div>
            <span class="chevron">${descOpen ? '▲' : '▼'}</span>
          </div>
          ${descOpen
            ? html `
                <div class="creator-sub-body">
                  <textarea
                    class="code-textarea"
                    rows="3"
                    placeholder="Describe what this module styles or extends..."
                    .value="${draft.description}"
                    @input="${(e) => {
                this._creatorDraft = {
                    ...this._creatorDraft,
                    description: e.target.value,
                };
            }}"
                  ></textarea>
                </div>
              `
            : html ``}
        </div>

        <!-- 3. Code (CSS/JS template) Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('code_template')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:code-braces"></ha-icon>
              <span>Code (CSS/JS template)</span>
            </div>
            <span class="chevron">${codeOpen ? '▲' : '▼'}</span>
          </div>
          ${codeOpen
            ? html `
                <div class="creator-sub-body">
                  ${this._renderCodeEditorWidget(draft.codeTemplate, (val) => {
                this._creatorDraft = {
                    ...this._creatorDraft,
                    codeTemplate: val,
                };
            }, true)}
                  <span class="field-caption-note">
                    More information and examples about the CSS and JS template possibilities
                    can be found in the <u>Styling and Templates documentation</u>.
                  </span>
                </div>
              `
            : html ``}
        </div>

        <!-- 4. Optional: Editor schema (YAML) Accordion (Screenshots 3, 4, 5) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('editor_schema')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:view-list-outline"></ha-icon>
              <span>Optional: Editor schema (YAML)</span>
            </div>
            <span class="chevron">${schemaOpen ? '▲' : '▼'}</span>
          </div>
          ${schemaOpen
            ? html `
                <div class="creator-sub-body">
                  ${this._renderCodeEditorWidget(draft.editorSchemaYaml, (val) => {
                this._creatorDraft = {
                    ...this._creatorDraft,
                    editorSchemaYaml: val,
                };
            }, false)}
                  <span class="field-caption-note">
                    This allows you to add a visual editor to your module. Learn about all
                    available editor schema options in the <u>editor schema documentation</u>.
                  </span>
                </div>
              `
            : html ``}
        </div>

        <!-- 5. Optional: Entity suggestions Accordion (Screenshots 3, 4) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('entity_suggestions')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:lightbulb-question-outline"></ha-icon>
              <span>Optional: Entity suggestions</span>
            </div>
            <span class="chevron">${sugOpen ? '▲' : '▼'}</span>
          </div>
          ${sugOpen
            ? html `
                <div class="creator-sub-body">
                  <span class="sub-block-heading">Suggestion rules (YAML)</span>
                  ${this._renderCodeEditorWidget(draft.suggestionRulesYaml, (val) => {
                this._creatorDraft = {
                    ...this._creatorDraft,
                    suggestionRulesYaml: val,
                };
            }, false)}
                  <span class="field-caption-note">
                    This allows your Module to be offered in the entity card picker of Home
                    Assistant, as a list of rules.
                  </span>

                  <span class="sub-block-heading">Computed suggestions (JavaScript)</span>
                  ${this._renderCodeEditorWidget(draft.computedSuggestionsJs, (val) => {
                this._creatorDraft = {
                    ...this._creatorDraft,
                    computedSuggestionsJs: val,
                };
            }, false)}
                  <span class="field-caption-note">
                    When a configuration has to be computed instead of being known in advance,
                    write a function body called with
                    <code>(hass, entity, stateObj, helpers, module)</code>.
                  </span>

                  <!-- Live Preview Sandbox Card (Screenshot 4) -->
                  <div class="creator-preview-card">
                    <span class="sub-block-heading">Preview</span>
                    ${this._renderToggleRow('Show the suggestions instead of the card', this._creatorPreviewMode, (val) => (this._creatorPreviewMode = val))}
                    <span class="section-caption">Entity</span>
                    <div
                      class="ha-entity-box"
                      @click="${() => this._openEntityPicker({ type: 'creator_preview' })}"
                    >
                      <div class="entity-icon-badge">
                        <ha-icon
                          .icon="${this._getEntityIcon(this._creatorPreviewEntity)}"
                        ></ha-icon>
                      </div>
                      <div class="entity-text-col">
                        <span class="entity-primary">
                          ${this._getEntityFriendlyName(this._creatorPreviewEntity)}
                        </span>
                        <span class="entity-secondary">
                          ${this._getEntitySecondary(this._creatorPreviewEntity)}
                        </span>
                      </div>
                      <span class="dropdown-caret">▼</span>
                    </div>
                  </div>
                </div>
              `
            : html ``}
        </div>

        <!-- 6. Export Module Accordion (Screenshot 3, 4) -->
        <div class="creator-sub-section">
          <div
            class="creator-sub-header"
            @click="${() => this._toggleCreatorSection('export_module')}"
          >
            <div class="header-left">
              <ha-icon icon="mdi:export"></ha-icon>
              <span>Export Module</span>
            </div>
            <span class="chevron">${expOpen ? '▲' : '▼'}</span>
          </div>
          ${expOpen
            ? html `
                <div class="creator-sub-body export-pills-stack">
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${() => this._copyModuleYaml(false)}"
                  >
                    <ha-icon icon="mdi:content-copy"></ha-icon>
                    <span>Copy YAML</span>
                  </button>
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${() => this._copyModuleYaml(true)}"
                  >
                    <ha-icon icon="mdi:content-duplicate"></ha-icon>
                    <span>Copy for GitHub</span>
                  </button>
                  <button
                    type="button"
                    class="export-full-pill"
                    @click="${this._downloadModuleYaml}"
                  >
                    <ha-icon icon="mdi:file-download-outline"></ha-icon>
                    <span>Download YAML</span>
                  </button>
                </div>
              `
            : html ``}
        </div>

        <!-- Bottom Cancel & Save Module Bar (Screenshot 4) -->
        <div class="creator-bottom-actions">
          <button
            type="button"
            class="teal-action-pill secondary-pill"
            @click="${() => (this._creatorOpen = false)}"
          >
            <span>✕</span>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            class="teal-action-pill"
            @click="${this._saveCreatorModule}"
          >
            <ha-icon icon="mdi:content-save-outline"></ha-icon>
            <span>Save Module</span>
          </button>
        </div>
      </div>
    `;
    }
    _renderCodeEditorWidget(value, onChange, showSnippets) {
        return html `
      <div class="aurora-code-widget">
        <div class="code-widget-toolbar">
          <div class="snippet-chips-row">
            ${showSnippets
            ? html `
                  <button
                    type="button"
                    class="snippet-chip"
                    @click="${() => onChange(value + '\n/* State check */\n${state === "on" ? "" : ""}')}"
                  >
                    + state
                  </button>
                  <button
                    type="button"
                    class="snippet-chip"
                    @click="${() => onChange(value +
                '\n.aurora-card {\n  backdrop-filter: blur(22px);\n}')}"
                  >
                    + glass
                  </button>
                `
            : html ``}
          </div>
          <div class="toolbar-icons-right">
            <button
              type="button"
              class="code-tool-btn"
              title="Copy code"
              @click="${() => {
            if (navigator.clipboard)
                navigator.clipboard.writeText(value);
            this._showToast('Code copied');
        }}"
            >
              <ha-icon icon="mdi:content-copy"></ha-icon>
            </button>
          </div>
        </div>
        <div class="code-gutter-body">
          <div class="line-num-gutter">1</div>
          <textarea
            class="gutter-textarea"
            rows="4"
            .value="${value}"
            @input="${(e) => onChange(e.target.value)}"
          ></textarea>
        </div>
      </div>
    `;
    }
    _renderModuleStoreView() {
        const query = this._moduleSearchFilter.trim().toLowerCase();
        const storeList = STORE_COMMUNITY_MODULES.filter((m) => {
            if (!query)
                return true;
            return (m.name.toLowerCase().includes(query) ||
                m.description.toLowerCase().includes(query));
        });
        return html `
      <div class="module-search-row">
        <div class="module-search-bar">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search community store..."
            .value="${this._moduleSearchFilter}"
            @input="${(e) => (this._moduleSearchFilter = e.target.value)}"
          />
        </div>
      </div>

      <div class="store-cards-list">
        ${storeList.map((storeMod) => {
            const isInstalled = this._installedModules.some((m) => m.id === storeMod.id);
            return html `
            <div class="store-module-card">
              <div class="store-mod-top">
                <div class="header-left">
                  <ha-icon icon="mdi:puzzle-star-outline"></ha-icon>
                  <span class="mod-item-title">${storeMod.name}</span>
                </div>
                <span class="mod-version-badge">${storeMod.version}</span>
              </div>
              <p class="store-mod-desc">${storeMod.description}</p>
              <div class="store-mod-footer">
                <span class="mod-creator-credit">By ${storeMod.creator}</span>
                <button
                  type="button"
                  class="teal-action-pill store-install-btn"
                  @click="${() => this._installFromStore(storeMod)}"
                >
                  <ha-icon
                    .icon="${isInstalled ? 'mdi:check' : 'mdi:download'}"
                  ></ha-icon>
                  <span>${isInstalled ? 'Installed (Open)' : 'Install Module'}</span>
                </button>
              </div>
            </div>
          `;
        })}
      </div>
    `;
    }
    _renderToggleRow(label, checked, onChange) {
        return html `
      <label class="ha-toggle-row">
        <button
          type="button"
          role="switch"
          aria-checked="${checked ? 'true' : 'false'}"
          class="ha-pill-switch"
          ?data-checked="${checked}"
          @click="${() => onChange(!checked)}"
        >
          <span class="switch-thumb"></span>
        </button>
        <span class="toggle-label">${label}</span>
      </label>
    `;
    }
    _renderActionSelector(field, currentAction) {
        return html `
      <div class="ha-filled-box">
        <div class="box-content">
          <span class="floating-label">Action</span>
          <select
            class="native-select"
            .value="${currentAction}"
            @change="${(e) => this._actionChanged(e, field)}"
          >
            <option value="toggle">Toggle</option>
            <option value="more-info">More info</option>
            <option value="navigate">Navigate / Pop-up (#hash)</option>
            <option value="call-service">Perform action (Call service)</option>
            <option value="none">No action</option>
          </select>
        </div>
      </div>
    `;
    }
    _formatChipLabel(chip) {
        const map = {
            state: 'State',
            preset_mode: 'Preset',
            hvac_action: 'Current action',
            last_changed: 'Last changed',
            brightness: 'Brightness',
        };
        return map[chip] ? map[chip] : chip;
    }
    _addStateChip() {
        if (!this._config)
            return;
        const pool = ['state', 'preset_mode', 'hvac_action', 'last_changed', 'brightness'];
        const current = [...(this._config.state_content ?? ['state'])];
        const next = pool.find((item) => !current.includes(item)) ?? 'state';
        current.push(next);
        this._setDirectValue('state_content', current);
    }
    _removeStateChip(index) {
        if (!this._config)
            return;
        const current = [...(this._config.state_content ?? [])];
        const updated = current.filter((_, i) => i !== index);
        this._setDirectValue('state_content', updated);
    }
    _valueChanged(e, field) {
        if (!this._config)
            return;
        const target = e.target;
        const val = target.value;
        this._setDirectValue(field, val === '' ? undefined : val);
    }
    _setDirectValue(field, value) {
        if (!this._config)
            return;
        this._config = {
            ...this._config,
            [field]: value,
        };
        fireEvent(this, 'config-changed', { config: this._config });
    }
    _actionChanged(e, field) {
        if (!this._config)
            return;
        const target = e.target;
        const existing = this._config[field] ?? {};
        this._config = {
            ...this._config,
            [field]: {
                ...existing,
                action: target.value,
            },
        };
        fireEvent(this, 'config-changed', { config: this._config });
    }
    _addSubButton() {
        if (!this._config)
            return;
        const current = [...(this._config.sub_button ?? [])];
        current.push({ icon: 'mdi:power', show_state: true });
        this._setDirectValue('sub_button', current);
    }
    _updateSubButton(index, key, val) {
        if (!this._config || !this._config.sub_button)
            return;
        const updated = [...this._config.sub_button];
        updated[index] = {
            ...updated[index],
            [key]: val === '' ? undefined : val,
        };
        this._setDirectValue('sub_button', updated);
    }
    _removeSubButton(index) {
        if (!this._config || !this._config.sub_button)
            return;
        const updated = this._config.sub_button.filter((_, i) => i !== index);
        this._setDirectValue('sub_button', updated);
    }
    static { this.styles = css `
    :host {
      display: block;
      color: var(--primary-text-color, #e1e1e1);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }

    .aurora-editor-root {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 0 16px 0;
    }

    .aurora-toast {
      position: sticky;
      top: 6px;
      z-index: 100;
      background: #0284c7;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    /* Hybrid Category Bar */
    .category-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .cat-pill {
      background: var(--secondary-background-color, #202124);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 18px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .cat-pill[data-active] {
      background: var(--primary-color, #03a9f4);
      color: #ffffff;
      border-color: var(--primary-color, #03a9f4);
    }

    /* Top Floating-Label Boxes */
    .top-selectors {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-caption {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      margin-bottom: -4px;
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
    }

    .box-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 2px;
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
    }

    .native-select option,
    .native-select optgroup {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #ffffff);
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
    }

    /* Entity Box */
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
      transition: background 0.15s ease;
    }

    .ha-entity-box:hover {
      background: rgba(255, 255, 255, 0.1);
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

    .dropdown-caret {
      font-size: 10px;
      color: var(--secondary-text-color, #9b9b9b);
      padding-left: 4px;
    }

    /* PHASE 2: Searchable Entity Picker Modal Overlay */
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

    .picker-sheet {
      width: 100%;
      max-width: 540px;
      height: 84vh;
      background: var(--card-background-color, #141414);
      border-radius: 20px 20px 0 0;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.6);
    }

    .picker-handle-bar {
      display: flex;
      justify-content: center;
      padding: 10px 0 4px 0;
    }

    .sheet-grip {
      width: 38px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.25);
    }

    .picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px 10px 14px;
    }

    .picker-search-Input-wrap {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      border-radius: 10px;
      padding: 8px 12px;
    }

    .picker-search-Input-wrap:focus-within {
      border-color: var(--primary-color, #03a9f4);
    }

    .search-icon {
      color: var(--primary-text-color, #ffffff);
      --mdc-icon-size: 20px;
    }

    .picker-search-input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 15px;
      width: 100%;
      outline: none;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      padding: 6px 8px;
    }

    .picker-domain-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 0 14px 10px 14px;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
    }

    .dom-chip {
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #9b9b9b);
      border: 1px solid transparent;
      border-radius: 14px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }

    .dom-chip[data-active] {
      background: rgba(3, 169, 244, 0.2);
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
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
      transition: background 0.12s ease;
    }

    .picker-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .picker-row[data-selected] {
      background: rgba(3, 169, 244, 0.18);
    }

    .picker-row-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      color: var(--secondary-text-color, #a0a0a0);
    }

    .picker-row[data-selected] .picker-row-icon {
      color: var(--primary-color, #38bdf8);
    }

    .picker-row-main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      gap: 2px;
    }

    .picker-row-title {
      font-size: 15px;
      color: var(--primary-text-color, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .picker-row-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .picker-row-domain {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
      white-space: nowrap;
      padding-left: 8px;
    }

    .picker-empty,
    .picker-more-hint {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    /* Main Accordions Stack */
    .accordions-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ha-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      background: var(--card-background-color, #1c1c1c);
      overflow: hidden;
    }

    .ha-accordion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .chevron {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .ha-accordion-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 16px 16px 16px;
    }

    /* Nested Accordions */
    .ha-nested-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      overflow: hidden;
    }

    .ha-nested-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      cursor: pointer;
    }

    .ha-nested-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 14px 14px 14px;
    }

    /* HA Pill Switches */
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 4px 0;
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
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .ha-pill-switch[data-checked] {
      background: rgba(3, 169, 244, 0.35);
      border-color: var(--primary-color, #03a9f4);
    }

    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--secondary-text-color, #9b9b9b);
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .ha-pill-switch[data-checked] .switch-thumb {
      transform: translateX(20px);
      background: var(--primary-color, #03a9f4);
    }

    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color, #e1e1e1);
    }

    /* State Content Chips */
    .state-content-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .block-label {
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
    }

    .chips-well {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      border-radius: 6px;
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
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 13px;
    }

    .chip-drag {
      color: var(--secondary-text-color, #9b9b9b);
      cursor: grab;
    }

    .chip-remove {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      font-size: 12px;
      padding: 0 2px;
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

    /* Sub-button rows */
    .sub-button-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
      padding: 8px;
      border-radius: 8px;
    }

    .sub-entity-picker-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 10px;
      cursor: pointer;
      overflow: hidden;
      text-align: left;
    }

    .sub-ent-label {
      flex: 1;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-icon-input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 13px;
    }

    .danger-icon-btn {
      background: rgba(244, 67, 54, 0.15);
      color: #f44336;
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }

    /* Info Callout Box */
    .ha-info-callout {
      background: rgba(255, 255, 255, 0.04);
      border-left: 4px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--secondary-text-color, #b0b0b0);
    }

    .callout-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      margin-bottom: 6px;
    }

    .callout-list {
      margin: 6px 0 0 0;
      padding-left: 18px;
    }

    .callout-list li {
      margin-bottom: 4px;
    }

    /* ============================================================================
       PHASE 3 STYLES: MODULES, MODULE CREATOR STUDIO & MODULE STORE
       ============================================================================ */
    .module-subtabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
    }

    .mod-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--secondary-text-color, #9b9b9b);
      padding: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .mod-tab[data-active] {
      color: var(--primary-text-color, #ffffff);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .module-search-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .module-search-bar {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 24px;
      padding: 8px 14px;
    }

    .module-search-bar input {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #ffffff);
      font-size: 14px;
      width: 100%;
      outline: none;
    }

    .sort-icon-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color, #9b9b9b);
      cursor: pointer;
      padding: 6px;
    }

    .modules-accordion-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .module-item-accordion {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      overflow: hidden;
      opacity: 0.55;
      transition: all 0.18s ease;
    }

    .module-item-accordion[data-compatible] {
      opacity: 1;
    }

    .module-item-accordion[data-active] {
      border-color: var(--primary-color, #03a9f4);
      box-shadow: 0 0 0 1px rgba(3, 169, 244, 0.25);
    }

    .module-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
    }

    .mod-puzzle-icon {
      color: var(--secondary-text-color, #9b9b9b);
    }

    .module-item-accordion[data-active] .mod-puzzle-icon {
      color: var(--primary-color, #03a9f4);
    }

    .mod-item-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }

    .unsupported-tag {
      font-size: 10px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--secondary-text-color, #9b9b9b);
      padding: 2px 6px;
      border-radius: 8px;
    }

    .module-item-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 14px 16px 14px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.07));
    }

    /* APPLY TO Bar (Screenshots 7, 11, 12) */
    .apply-to-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 8px;
    }

    .apply-to-caption {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .apply-to-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .apply-pills-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .apply-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      border-radius: 18px;
      color: var(--primary-text-color, #ffffff);
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 15px;
    }

    .apply-pill[data-selected] {
      background: rgba(3, 169, 244, 0.22);
      border-color: var(--primary-color, #03a9f4);
      color: #ffffff;
    }

    .circle-help-btn {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.25));
      background: transparent;
      color: var(--secondary-text-color, #9b9b9b);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .apply-actions-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .icon-tool-btn {
      background: transparent;
      border: none;
      color: var(--primary-text-color, #e1e1e1);
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      --mdc-icon-size: 18px;
    }

    .icon-tool-btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .mod-config-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #e1e1e1);
      --mdc-icon-size: 18px;
    }

    .mod-controls-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .media-dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 1px dashed var(--divider-color, rgba(255, 255, 255, 0.22));
      border-radius: 10px;
      padding: 20px 12px;
      background: rgba(255, 255, 255, 0.02);
    }

    .media-pick-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color, #38bdf8);
      border: 1px solid rgba(3, 169, 244, 0.35);
      border-radius: 16px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .slider-control-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .slider-label {
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .slider-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ha-range-slider {
      flex: 1;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .slider-num-box {
      width: 58px;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 6px;
      color: var(--primary-text-color, #ffffff);
      padding: 6px 8px;
      font-size: 13px;
      text-align: center;
    }

    .num-circle-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      font-size: 12px;
      font-weight: 700;
    }

    /* About This Module & YAML Code Preview (Screenshots 7, 11, 12) */
    .yaml-code-preview {
      background: #0c4a6e;
      color: #e0f2fe;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      line-height: 1.45;
      overflow-x: auto;
      margin: 10px 0;
    }

    .mod-about-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      padding-top: 6px;
    }

    .mod-creator-credit {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
    }

    .mod-version-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
    }

    /* Action Pills Row (Create new Module | Import from YAML - Screenshot 6) */
    .module-action-pills-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 4px 0;
    }

    .teal-action-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #0c4a6e;
      color: #ffffff;
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 24px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .teal-action-pill:hover {
      background: #075985;
    }

    .secondary-pill {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .import-yaml-drawer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
    }

    /* Creator Studio View (Screenshots 3, 4, 5) */
    .creator-studio-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 6px;
    }

    .creator-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      padding: 4px 0;
    }

    .field-caption-note {
      font-size: 11px;
      color: var(--secondary-text-color, #9b9b9b);
      line-height: 1.4;
      margin-top: -4px;
    }

    .creator-sub-section {
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .creator-sub-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 4px;
      cursor: pointer;
    }

    .creator-sub-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0 4px 8px 4px;
    }

    .checkbox-two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      padding-top: 6px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }

    .ha-checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--primary-text-color, #e1e1e1);
      cursor: pointer;
    }

    .ha-checkbox-item input[type='checkbox'] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Code Editor Widget with Line Number Gutter (Screenshots 4 & 5) */
    .aurora-code-widget {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      border-radius: 8px;
      overflow: hidden;
      background: #141414;
    }

    .code-widget-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0c2d48;
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .snippet-chips-row {
      display: flex;
      gap: 6px;
    }

    .snippet-chip {
      background: rgba(255, 255, 255, 0.1);
      color: #bae6fd;
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
      font-family: monospace;
      cursor: pointer;
    }

    .toolbar-icons-right {
      display: flex;
      gap: 6px;
    }

    .code-tool-btn {
      background: transparent;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      padding: 2px 4px;
      --mdc-icon-size: 16px;
    }

    .code-gutter-body {
      display: flex;
      min-height: 84px;
    }

    .line-num-gutter {
      width: 28px;
      background: #1a1a1a;
      color: #64748b;
      font-family: monospace;
      font-size: 12px;
      padding: 10px 4px;
      text-align: center;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      user-select: none;
    }

    .gutter-textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: #e2e8f0;
      font-family: monospace;
      font-size: 13px;
      padding: 10px;
      outline: none;
      resize: vertical;
    }

    .sub-block-heading {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
      margin-top: 4px;
    }

    .creator-preview-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);
    }

    .export-pills-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .export-full-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: #0c4a6e;
      color: #ffffff;
      border: none;
      border-radius: 28px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .export-full-pill:hover {
      background: #075985;
    }

    .creator-bottom-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6px;
    }

    /* Module Store Cards */
    .store-cards-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .store-module-card {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 14px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .store-mod-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .store-mod-desc {
      margin: 0;
      font-size: 12px;
      line-height: 1.45;
      color: var(--secondary-text-color, #b0b0b0);
    }

    .store-mod-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .store-install-btn {
      padding: 6px 14px;
      font-size: 12px;
    }

    .code-textarea {
      width: 100%;
      box-sizing: border-box;
      background: #141414;
      color: #e2e8f0;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.15));
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 13px;
      outline: none;
    }

    .muted-note {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color, #9b9b9b);
    }
  `; }
};
__decorate([
    property({ attribute: false })
], AuroraCardEditor.prototype, "hass", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_config", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_activeCategory", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_moduleSubTab", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_moduleSearchFilter", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_pickerOpen", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_pickerTarget", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_pickerSearchQuery", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_pickerDomainFilter", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_installedModules", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_expandedModules", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_moduleInnerAccordions", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_creatorOpen", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_importYamlOpen", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_importYamlText", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_statusToast", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_creatorDraft", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_creatorPreviewMode", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_creatorPreviewEntity", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_creatorSections", void 0);
__decorate([
    state()
], AuroraCardEditor.prototype, "_openSections", void 0);
AuroraCardEditor = __decorate([
    customElement('aurora-card-editor')
], AuroraCardEditor);
export { AuroraCardEditor };
