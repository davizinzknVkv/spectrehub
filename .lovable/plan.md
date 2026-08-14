# Plan - Presence Settings Restoration

Restore and implement the **Presence Settings** protocol in the Spectre Hub dashboard, allowing users to configure their Discord Status, Custom Status, and Rich Presence through an industrial-themed interface as requested.

## Technical Details

### 1. Backend Logic
- Create `src/lib/presence.functions.ts` to handle Discord API interactions for status updates.
- Update `src/lib/quest-runner.ts` to include presence data fetching (user settings).

### 2. UI Components
- **PresenceModal**: A high-fidelity industrial modal using the NGHC design system.
  - **Status Tab**: Toggle between Online, Idle, DnD, and Invisible.
  - **Custom Status Tab**: Set text and emojis with a Spectre Pink toggle.
  - **Rich Presence Tab**: Configure advanced activity metrics (Playing/Watching/Listening), details, state, and assets (Large/Small images).
- **Dashboard Integration**: Add a "Presence Settings" action card in `src/routes/_app.hub.tsx` to launch the modal.

### 3. State Management
- Extend `useQuestStore` to persist presence preferences locally.
- Implement real-time feedback when presence changes are applied.

## Visual Direction
- **Theme**: Absolute Obsidian (#030303) with Spectre Pink (#ff0055) accents.
- **Typography**: Archivo Black for headers, Inter Tight for body.
- **Elements**: 0px radius, glassmorphism, industrial scrollbars, and hexagonal buttons (`ds-btn`).
