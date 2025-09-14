/**
 * Nevka Mobile v1.0
 * 2025 Avicus Delacroix
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: 'rgba(0, 0, 0, 0.7)',
    background: 'rgba(237, 249, 252, 1)',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabs: 'rgba(220, 247, 255, 1)'
  },
  dark: {
    text: 'rgba(255, 255, 255, 0.7)',
    background: 'rgba(2, 15, 23, 1)',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    tabs: 'rgba(0, 7, 10, 1)'
  }
};
