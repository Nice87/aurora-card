export const climateQuickDial = {
    id: 'climate_quick_dial',
    name: 'Climate Quick Dial',
    version: 'v1.0.0',
    creator: 'Aurora Studio',
    description: 'Injects an interactive mini-slider directly onto climate cards.',
    type: 'base-extension',
    supportedCards: ['climate'],
    codeTemplate: `
.aurora-climate-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  background: rgba(255,255,255,0.05);
  padding: 6px 12px;
  border-radius: 12px;
}
  `,
    editorSchemaYaml: `
show_mode_selector:
  type: boolean
  default: true
step_size:
  type: number
  default: 0.5
  `,
    yamlExample: 'climate_quick_dial:\n  show_mode_selector: true\n  step_size: 0.5',
    builtIn: true,
};
