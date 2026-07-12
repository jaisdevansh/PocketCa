import { Tabs } from 'expo-router';
import { Icon } from '@/shared/components/Icon';
import { useColorScheme, Platform } from 'react-native';
import { colors } from '@/core/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.mutedText,
        tabBarStyle: {
          backgroundColor: c.background,
          borderTopWidth: 1,
          borderTopColor: c.borderHairline,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 70,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          // Removes any background pill
          backgroundColor: 'transparent',
        }
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="Home" color={color} size={22} />
        }} 
      />
      <Tabs.Screen 
        name="goals" 
        options={{ 
          title: 'Goals',
          tabBarIcon: ({ color }) => <Icon name="Target" color={color} size={22} />
        }} 
      />
      <Tabs.Screen 
        name="ai-coach" 
        options={{ 
          title: 'AI Coach',
          tabBarIcon: ({ color }) => <Icon name="Bot" color={color} size={22} />
        }} 
      />
      <Tabs.Screen 
        name="insights" 
        options={{ 
          title: 'Insights',
          tabBarIcon: ({ color }) => <Icon name="PieChart" color={color} size={22} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="User" color={color} size={22} />
        }} 
      />
    </Tabs>
  );
}
