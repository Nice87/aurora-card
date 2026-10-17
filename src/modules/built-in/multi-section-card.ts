import { AuroraModuleDefinition } from '../module.interface';

export const multiSectionCard: AuroraModuleDefinition = {
  id: 'multi_section_card',
  name: 'Multi Section Card',
  version: 'v1.1.0',
  creator: 'Aurora Studio',
  description: 'Splits the card into a multi-column grid (2, 3, or 4 sections) for compact sub-entities.',
  type: 'base-extension',
  supportedCards: ['button', 'separator'],
  codeTemplate: `
.aurora-card-content {
  display: grid;
  grid-template-columns: repeat(\${module.section_count}, 1fr);
  gap: 8px;
  align-items: center;
}
  `,
  editorSchemaYaml: `
section_count:
  type: select
  options: ["2", "3", "4"]
  default: "3"
  `,
  yamlExample: 'multi_section_card:\n  section_count: "3"',
  builtIn: true,
};