import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PocketButton } from '@/shared/components/PocketButton';
import { TopBar } from '@/shared/components/TopBar';
import { Spacer } from '@/shared/components/Spacer';

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <TopBar title="Goal Details" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.headerCard, { backgroundColor: '#f9f9f9', borderColor: '#ddd' }]}>
          <Text>Goal Details: {id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  headerCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
});
