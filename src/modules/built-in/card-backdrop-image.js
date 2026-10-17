export const cardBackdropImage = {
    id: 'card_backdrop_image',
    name: 'Card Backdrop Image',
    version: 'v1.2.0',
    creator: 'Aurora Studio',
    description: 'Add a configurable image backdrop to an individual card with blur, scale, and overlay options.',
    type: 'base-extension',
    supportedCards: ['button', 'climate', 'media-player', 'pop-up', 'cover'],
    codeTemplate: `
.aurora-card {
  background-image: url("\${module.image_url}");
  background-size: \${module.size};
  background-position: center;
}
.aurora-card::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(\${module.blur}px);
  background: rgba(0,0,0,\${module.darken});
  z-index: 0;
}
.aurora-card > * {
  z-index: 1;
}
  `,
    editorSchemaYaml: `
image_url:
  type: string
size:
  type: select
  options: [cover, contain]
blur:
  type: number
  default: 0
darken:
  type: number
  default: 0.2
  `,
    yamlExample: 'card_backdrop_image:\n  image_url: "/local/bg.jpg"\n  size: cover\n  blur: 4\n  darken: 0.5',
    builtIn: true,
};
