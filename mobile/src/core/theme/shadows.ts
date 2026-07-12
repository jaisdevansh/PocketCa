import { Platform } from 'react-native';
import { colors } from './colors';

// Soft, minimal shadow system
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: colors.light.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),
  bottomSheet: Platform.select({
    ios: {
      shadowColor: colors.light.textPrimary,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: {
      elevation: 10,
    },
  }),
  fab: Platform.select({
    ios: {
      shadowColor: colors.light.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
  }),
};
