# Aurora Card 🌌

High-performance, modular, glassmorphism-inspired custom Lovelace card suite for Home Assistant. Designed as a superior, zero-lag alternative to Bubble Card with native CSS variable theme integration and 17 advanced card architectures.

---

## ✨ Features

- **17 Card Architectures:** Includes Button / Slider, Pop-up Containers (`#hash`), Cover/Shutter, Climate, Media Player, Routine Macro Workflows, Energy Flow Matrices, Security & Doorbell Camera Hubs, Microclimate Radar, Multi-Room Audio, HVAC Zoning, Zigbee/Matter Mesh Topology, EV Chargers, Air Quality Matrices, and Interactive Floorplans.
- **Dynamic Theming:** 100% theme-driven via Home Assistant theme variables (`--aurora-*`). Selecting an Aurora theme instantly transforms your dashboards.
- **Universal Visibility Conditions:** Conditionally show or hide any card based on entity states or numeric thresholds without nested Lovelace cards.
- **Built-in WYSIWYG Editor:** Seamless graphical configuration directly inside Home Assistant's card editor.

---

## 📦 Installation (HACS)

1. Open **HACS** in your Home Assistant instance.
2. Click on **Frontend**.
3. Click the three dots in the top right corner and select **Custom repositories**.
4. Paste your repository URL (`https://github.com/Nice87/aurora-card`) and select **Plugin** as the category.
5. Click **Add**, then install **Aurora Card**.

---

## 🚀 Example YAML Configuration

```yaml
type: custom:aurora-card
card_type: button
button_type: slider
entity: light.living_room
name: Living Room Main
icon: mdi:ceiling-light
sub_button:
  - entity: light.living_room_spotlights
    icon: mdi:spotlight
  - entity: switch.living_room_tv
    icon: mdi:television