export function fireEvent(node, type, detail = {}, options = {}) {
    const event = new CustomEvent(type, {
        bubbles: options.bubbles ?? true,
        composed: options.composed ?? true,
        detail,
    });
    node.dispatchEvent(event);
    return event;
}
export function handleAction(node, hass, config, actionType) {
    const action = actionType === 'tap' ? config.tap_action : config.hold_action;
    const actionName = action?.action || (actionType === 'tap' ? 'toggle' : 'more-info');
    switch (actionName) {
        case 'toggle':
            if (config.entity) {
                hass.callService('homeassistant', 'toggle', { entity_id: config.entity });
            }
            break;
        case 'navigate':
            if (action?.navigation_path) {
                if (action.navigation_path.startsWith('#')) {
                    window.location.hash = action.navigation_path;
                    fireEvent(window, 'location-changed', {});
                }
                else {
                    history.pushState(null, '', action.navigation_path);
                    fireEvent(window, 'location-changed', {});
                }
            }
            break;
        case 'call-service':
            if (action?.service) {
                const [domain, service] = action.service.split('.');
                const serviceData = { ...(action.service_data || {}) };
                if (config.entity && !serviceData.entity_id) {
                    serviceData.entity_id = config.entity;
                }
                hass.callService(domain, service, serviceData);
            }
            break;
        case 'more-info':
            if (config.entity) {
                fireEvent(node, 'hass-more-info', { entityId: config.entity });
            }
            break;
        case 'none':
        default:
            break;
    }
}
