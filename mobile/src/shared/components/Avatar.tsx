import React from 'react';
import { View, Image, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '../../core/theme/colors';

interface AvatarProps {
  url?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ url, size = 44 }) => {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  
  return (
    <View style={[styles.container, { width: size, height: size, borderColor: c.borderHairline }]}>
      {url ? (
        <Image source={{ uri: url }} style={{ width: size - 2, height: size - 2, borderRadius: (size - 2) / 2 }} />
      ) : (
        <View style={[styles.placeholder, { width: size - 2, height: size - 2, borderRadius: (size - 2) / 2, backgroundColor: c.surfaceVariant }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 9999,
  },
  placeholder: {
    // Background color set dynamically
  },
});
