import { AuroraModuleDefinition } from './module.interface';
import { cardBackdropImage } from './built-in/card-backdrop-image';
import { multiSectionCard } from './built-in/multi-section-card';
import { animatedWeatherIcon } from './built-in/animated-weather-icon';
import { climateQuickDial } from './built-in/climate-quick-dial';
import { batteryHealthBadge } from './built-in/battery-health-badge';

export const BUILT_IN_MODULES: AuroraModuleDefinition[] = [
  cardBackdropImage,
  multiSectionCard,
  animatedWeatherIcon,
  climateQuickDial,
  batteryHealthBadge
];

class ModuleRegistry {
  private userModules: Map<string, AuroraModuleDefinition> = new Map();

  public getAllModules(): AuroraModuleDefinition[] {
    return [...BUILT_IN_MODULES, ...Array.from(this.userModules.values())];
  }

  public registerUserModule(mod: AuroraModuleDefinition): void {
    this.userModules.set(mod.id, { ...mod, builtIn: false });
  }

  public deleteUserModule(id: string): boolean {
    return this.userModules.delete(id);
  }
}

export const moduleRegistry = new ModuleRegistry();