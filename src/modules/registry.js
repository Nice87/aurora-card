import { cardBackdropImage } from './built-in/card-backdrop-image';
import { multiSectionCard } from './built-in/multi-section-card';
import { animatedWeatherIcon } from './built-in/animated-weather-icon';
import { climateQuickDial } from './built-in/climate-quick-dial';
import { batteryHealthBadge } from './built-in/battery-health-badge';
export const BUILT_IN_MODULES = [
    cardBackdropImage,
    multiSectionCard,
    animatedWeatherIcon,
    climateQuickDial,
    batteryHealthBadge
];
class ModuleRegistry {
    constructor() {
        this.userModules = new Map();
    }
    getAllModules() {
        return [...BUILT_IN_MODULES, ...Array.from(this.userModules.values())];
    }
    registerUserModule(mod) {
        this.userModules.set(mod.id, { ...mod, builtIn: false });
    }
    deleteUserModule(id) {
        return this.userModules.delete(id);
    }
}
export const moduleRegistry = new ModuleRegistry();
