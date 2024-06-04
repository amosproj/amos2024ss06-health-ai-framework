import { MD3LightTheme } from 'react-native-paper';
import type { MD3Typescale, ThemeProp } from 'react-native-paper/lib/typescript/types';
import { Fonts } from './fonts';

const FontsTheme: MD3Typescale = {
  ...MD3LightTheme.fonts,
  displaySmall: {
    ...MD3LightTheme.fonts.displaySmall,
    fontFamily: Fonts.EXTRA_BOLD
  },
  displayMedium: {
    ...MD3LightTheme.fonts.displayMedium,
    fontFamily: Fonts.EXTRA_BOLD
  },
  displayLarge: {
    ...MD3LightTheme.fonts.displayLarge,
    fontFamily: Fonts.EXTRA_BOLD
  },
  headlineLarge: {
    ...MD3LightTheme.fonts.headlineLarge,
    fontFamily: Fonts.BOLD
  },
  headlineMedium: {
    ...MD3LightTheme.fonts.headlineMedium,
    fontFamily: Fonts.BOLD
  },
  headlineSmall: {
    ...MD3LightTheme.fonts.headlineSmall,
    fontFamily: Fonts.BOLD
  },
  titleLarge: {
    ...MD3LightTheme.fonts.titleLarge,
    fontFamily: Fonts.SEMI_BOLD
  },
  titleMedium: {
    ...MD3LightTheme.fonts.titleMedium,
    fontFamily: Fonts.SEMI_BOLD
  },
  titleSmall: {
    ...MD3LightTheme.fonts.titleSmall,
    fontFamily: Fonts.SEMI_BOLD
  },
  labelLarge: {
    ...MD3LightTheme.fonts.labelLarge,
    fontFamily: Fonts.MEDIUM
  },
  labelMedium: {
    ...MD3LightTheme.fonts.labelMedium,
    fontFamily: Fonts.MEDIUM
  },
  labelSmall: {
    ...MD3LightTheme.fonts.labelSmall,
    fontFamily: Fonts.MEDIUM
  },
  bodyLarge: {
    ...MD3LightTheme.fonts.bodyLarge,
    fontFamily: Fonts.REGULAR
  },
  bodyMedium: {
    ...MD3LightTheme.fonts.bodyMedium,
    fontFamily: Fonts.REGULAR
  },
  bodySmall: {
    ...MD3LightTheme.fonts.bodySmall,
    fontFamily: Fonts.REGULAR
  }
};

export const LightTheme: ThemeProp = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006B5E',
    onPrimary: '#FFFFFF',
    primaryContainer: '#9FF2E1',
    onPrimaryContainer: '#00201B',
    secondary: '#4A635E',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CDE8E1',
    onSecondaryContainer: '#06201B',
    tertiary: '#446279',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#CAE6FF',
    onTertiaryContainer: '#001E30',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#F4FBF8',
    onBackground: '#171D1B',
    surface: '#F4FBF8',
    onSurface: '#171D1B',
    surfaceVariant: '#DAE5E1',
    onSurfaceVariant: '#3F4946',
    outline: '#6F7976',
    outlineVariant: '#BEC9C5',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2B3230',
    inverseOnSurface: '#ECF2EF',
    inversePrimary: '#83D5C5'
  },
  fonts: {
    ...FontsTheme
  }
};
