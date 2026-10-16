import {Platform, StyleSheet} from 'react-native';
import colors from './colors';

export const shadows = StyleSheet.create({
  soft: {
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  medium: {
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  strong: {
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
