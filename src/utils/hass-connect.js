export const fireEvent = (node, type, detail, options) => {
    const opts = options ?? {};
    const event = new CustomEvent(type, {
        bubbles: opts.bubbles === undefined ? true : opts.bubbles,
        cancelable: Boolean(opts.cancelable),
        composed: opts.composed === undefined ? true : opts.composed,
        detail: detail ?? {},
    });
    node.dispatchEvent(event);
    return event;
};
export const executeAuroraAction = (node, hass, config, actionConfig, overrideEntityId) => {
    if (!hass)
        return;
    const targetEntity = overrideEntityId ?? config.entity ?? '';
    const resolvedAction = typeof actionConfig === 'string'
        ? { action: 'toggle' }
        : actionConfig ?? config.tap_action ?? { action: 'toggle' };
    const act = resolvedAction.action ?? 'toggle';
    if (act === 'none')
        return;
    if (act === 'more-info') {
        if (targetEntity && node instanceof HTMLElement) {
            fireEvent(node, 'hass-more-info', { entityId: targetEntity });
        }
        return;
    }
    if (act === 'navigate') {
        const path = resolvedAction.navigation_path ?? config.hash ?? '#aurora-popup';
        if (path.startsWith('#')) {
            window.location.hash = path;
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
        else {
            window.history.pushState(null, '', path);
            if (window instanceof Window) {
                fireEvent(window, 'location-changed', { replace: false });
            }
        }
        return;
    }
    if (act === 'call-service' && resolvedAction.service) {
        const [domain, service] = resolvedAction.service.split('.');
        if (domain && service) {
            hass.callService(domain, service, resolvedAction.service_data ?? { entity_id: targetEntity });
        }
        return;
    }
    if (targetEntity) {
        const domain = targetEntity.split('.')[0];
        if (domain === 'scene' || domain === 'script') {
            hass.callService(domain, 'turn_on', { entity_id: targetEntity });
        }
        else {
            hass.callService('homeassistant', 'toggle', { entity_id: targetEntity });
        }
    }
};
/**
 * Compatibility alias for legacy cards using `handleAction`
 */
export const handleAction = (node, hass, config, actionConfig, overrideEntityId) => {
    executeAuroraAction(node, hass, config, actionConfig, overrideEntityId);
};
