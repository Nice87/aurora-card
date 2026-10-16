import { HomeAssistant } from 'custom-card-helpers';

export interface AuroraCondition {
  condition: 'state' | 'numeric_state';
  entity: string;
  state?: string | string[];
  above?: number;
  below?: number;
}

export function evaluateVisibility(hass: HomeAssistant, conditions?: AuroraCondition[]): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  return conditions.every(cond => {
    const stateObj = hass.states[cond.entity];
    if (!stateObj) return false;

    const currentState = stateObj.state;

    if (cond.condition === 'state') {
      if (Array.isArray(cond.state)) {
        return cond.state.includes(currentState);
      }
      return currentState === cond.state;
    }

    if (cond.condition === 'numeric_state') {
      const val = parseFloat(currentState);
      if (isNaN(val)) return false;

      if (cond.above !== undefined && val <= cond.above) return false;
      if (cond.below !== undefined && val >= cond.below) return false;
      return true;
    }

    return true;
  });
}