/**
 * Nevka Mobile v1.7
 * 2025-2026 Avicus Delacroix
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: 'rgba(0, 0, 0, 0.8)',
    background: 'rgba(188, 215, 229, 1)',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabs: 'rgba(131, 197, 231, 1)',
    borders: 'rgba(92, 198, 252, 0.5)'
  },
  dark: {
    text: 'rgba(255, 255, 255, 0.8)',
    background: 'rgba(3, 27, 39, 1)',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    tabs: 'rgba(0, 9, 15, 1)',
    borders: 'rgba(0, 85, 128, 0.5)'
  }
};
