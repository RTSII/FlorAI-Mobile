import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Surface, Button, useTheme } from 'react-native-paper';

const HomeScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Surface
        style={[styles.hero, { backgroundColor: theme.colors.primaryContainer }]}
        elevation={1}
      >
        <Text style={[styles.heroText, { color: theme.colors.onPrimaryContainer }]}>
          Welcome to FlorAI
        </Text>
        <Text style={[styles.heroSubtext, { color: theme.colors.onPrimaryContainer }]}>
          Identify plants, get care tips, and grow your plant collection
        </Text>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.ctaButton}
          contentStyle={styles.ctaButtonContent}
        >
          Identify a Plant
        </Button>
      </Surface>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Recent Identifications
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          No recent identifications
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Care Reminders</Text>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          No active reminders
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  hero: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 24,
  },
  ctaButtonContent: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
