import { css } from 'lit';

export const LuminaThemeStyles = css`
  :host {
    --aurora-card-background: var(--ha-card-background, var(--card-background-color, rgba(15, 23, 42, 0.68)));
    --aurora-card-backdrop-filter: blur(20px) saturate(180%);
    --aurora-card-border: 1px solid rgba(255, 255, 255, 0.09);
    --aurora-card-border-radius: var(--ha-card-border-radius, 20px);
    --aurora-card-shadow: 0 10px 32px 0 rgba(0, 0, 0, 0.42);
    --aurora-surface-subtle: rgba(255, 255, 255, 0.04);
    --aurora-surface-hover: rgba(255, 255, 255, 0.08);
    --aurora-text-primary: var(--primary-text-color, #f8fafc);
    --aurora-text-secondary: var(--secondary-text-color, #94a3b8);
    --aurora-accent-color: var(--primary-color, #818cf8);
    --aurora-accent-glow: rgba(129, 140, 248, 0.28);
    --aurora-success-color: #34d399;
    --aurora-warning-color: #fbbf24;
    --aurora-danger-color: #f87171;
  }
`;