export const animatedWeatherIcon = {
    id: 'animated_weather_icon',
    name: 'Animated Weather Icon',
    version: 'v1.0.0',
    creator: 'Aurora Studio',
    description: 'Replaces static weather icons with smooth CSS/SVG keyframe animations based on state.',
    type: 'base-extension',
    supportedCards: ['button', 'climate'],
    codeTemplate: `
@keyframes pulseWeather {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 10px var(--primary-color); }
  100% { transform: scale(1); opacity: 0.8; }
}
.aurora-icon-container {
  animation: pulseWeather 3s infinite ease-in-out;
}
  `,
    editorSchemaYaml: `
animation_intensity:
  type: select
  options: [subtle, normal, high]
  default: normal
  `,
    yamlExample: 'animated_weather_icon:\n  animation_intensity: normal',
    builtIn: true,
};
