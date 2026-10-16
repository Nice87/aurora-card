export const LUMINA_THEME_CONFIG = {
    "Aurora Lumina": {
        "primary-color": "#818cf8",
        "accent-color": "#38bdf8",
        "primary-background-color": "#090d16",
        "secondary-background-color": "#0f172a",
        "card-background-color": "rgba(15, 23, 42, 0.68)",
        "ha-card-background": "rgba(15, 23, 42, 0.68)",
        "ha-card-border-radius": "20px",
        "ha-card-border-width": "1px",
        "ha-card-border-color": "rgba(255, 255, 255, 0.09)",
        "primary-text-color": "#f8fafc",
        "secondary-text-color": "#94a3b8",
        "aurora-card-background": "rgba(15, 23, 42, 0.68)",
        "aurora-card-backdrop-filter": "blur(22px) saturate(190%)",
        "aurora-card-border": "1px solid rgba(255, 255, 255, 0.1)",
        "aurora-card-border-radius": "20px",
        "aurora-card-shadow": "0 12px 34px 0 rgba(0, 0, 0, 0.5)",
        "aurora-surface-subtle": "rgba(255, 255, 255, 0.04)",
        "aurora-surface-hover": "rgba(255, 255, 255, 0.09)",
        "aurora-text-primary": "#f8fafc",
        "aurora-text-secondary": "#94a3b8",
        "aurora-accent-color": "#818cf8",
        "aurora-accent-glow": "rgba(129, 140, 248, 0.32)",
        "aurora-success-color": "#34d399",
        "aurora-warning-color": "#fbbf24",
        "aurora-danger-color": "#f87171"
    }
};
export function registerAuroraTheme(hass) {
    if (!hass || window.__auroraThemeRegistered)
        return;
    hass.connection?.sendMessage({
        type: "frontend/set_themes",
        themes: LUMINA_THEME_CONFIG,
        default_theme: "Aurora Lumina"
    }).catch(() => { });
    window.__auroraThemeRegistered = true;
}
