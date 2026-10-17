export const batteryHealthBadge = {
    id: 'battery_health_badge',
    name: 'Battery Health Badge',
    version: 'v1.0.0',
    creator: 'Aurora Studio',
    description: 'Automatically scans for a battery entity and appends a color-coded status indicator.',
    type: 'base-extension',
    supportedCards: ['button', 'cover', 'media-player'],
    codeTemplate: `
.aurora-battery-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: \${ module.level > 50 ? 'rgba(76, 175, 80, 0.2)' : module.level > 20 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.4)' };
  color: \${ module.level > 50 ? '#4CAF50' : module.level > 20 ? '#FF9800' : '#F44336' };
  border: 1px solid currentColor;
}
  `,
    editorSchemaYaml: `
override_entity:
  type: string
show_percentage:
  type: boolean
  default: true
  `,
    yamlExample: 'battery_health_badge:\n  show_percentage: true',
    builtIn: true,
};
