export type AuroraModuleType = 'base-extension' | 'custom-card';

export interface AuroraModuleDefinition {
  id: string;
  name: string;
  version: string;
  creator: string;
  description: string;
  type: AuroraModuleType;
  supportedCards: string[];
  codeTemplate: string;
  editorSchemaYaml: string;
  yamlExample: string;
  builtIn?: boolean;
}