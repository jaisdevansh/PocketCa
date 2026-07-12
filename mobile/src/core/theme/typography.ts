// Typography hierarchy and font mappings
// Using Plus Jakarta Sans for the premium, geometric look

export const typography = {
  fontFamily: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
  sizes: {
    // New precise semantic sizes based on the premium UI spec
    heroBalance: { fontSize: 48, lineHeight: 52, letterSpacing: -1 }, // 48px, tight line-height
    sectionHeader: { fontSize: 18, lineHeight: 24, letterSpacing: -0.25 },
    cardTitle: { fontSize: 15, lineHeight: 20, letterSpacing: 0 },
    body: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    micro: { fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
    
    // Legacy support (mapped to closest new sizes to avoid breaking other screens)
    displayLarge: { fontSize: 48, lineHeight: 52, letterSpacing: -1 },
    displayMedium: { fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
    displaySmall: { fontSize: 24, lineHeight: 32, letterSpacing: -0.25 },
    heading1: { fontSize: 28, lineHeight: 36, letterSpacing: -0.5 },
    heading2: { fontSize: 24, lineHeight: 32, letterSpacing: -0.25 },
    heading3: { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
    heading4: { fontSize: 18, lineHeight: 24, letterSpacing: 0 },
    title: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
    subtitle: { fontSize: 14, lineHeight: 22, letterSpacing: 0.1 },
    bodyLarge: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
    bodyMedium: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
    bodySmall: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
    caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
    overline: { fontSize: 10, lineHeight: 14, letterSpacing: 1.5 },
  }
};
