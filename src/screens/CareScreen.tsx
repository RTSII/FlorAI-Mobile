import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useTheme, Card, Title, Paragraph, Button, Badge } from 'react-native-paper';

// Mock data for care tasks
const mockTasks = [
  {
    id: '1',
    plantName: 'Monstera Deliciosa',
    task: 'Watering',
    dueDate: 'Today',
    priority: 'high',
    image: 'https://example.com/monstera.jpg',
  },
  {
    id: '2',
    plantName: 'Snake Plant',
    task: 'Fertilize',
    dueDate: 'Tomorrow',
    priority: 'medium',
    image: 'https://example.com/snake-plant.jpg',
  },
  {
    id: '3',
    plantName: 'Fiddle Leaf Fig',
    task: 'Prune leaves',
    dueDate: 'In 3 days',
    priority: 'low',
    image: 'https://example.com/fiddle-leaf.jpg',
  },
];

const CareScreen = () => {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.primary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const renderTaskCard = (task: (typeof mockTasks)[0]) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.plantImageContainer}>
          <Image
            source={{ uri: task.image }}
            style={styles.plantImage}
            defaultSource={require('../../assets/images/placeholder-plant.png')}
          />
        </View>
        <View style={styles.taskInfo}>
          <View style={styles.taskHeader}>
            <Title style={[styles.plantName, { color: theme.colors.onSurface }]}>
              {task.plantName}
            </Title>
            <Badge
              style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}
            >
              {task.priority.toUpperCase()}
            </Badge>
          </View>
          <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{task.task}</Paragraph>
          <View style={styles.taskFooter}>
            <Paragraph style={[styles.dueDate, { color: theme.colors.primary }]}>
              {task.dueDate}
            </Paragraph>
            <Button mode="contained" compact onPress={() => {}} style={styles.actionButton}>
              Mark Done
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>Care Schedule</Title>
          <Button mode="text" onPress={() => {}} icon="calendar" textColor={theme.colors.primary}>
            View Calendar
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Today's Tasks
          </Text>
          {mockTasks.map((task) => (
            <View key={task.id} style={styles.taskCardWrapper}>
              {renderTaskCard(task)}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Upcoming</Text>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No upcoming tasks
            </Text>
          </View>
        </View>
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => {}}
        style={[styles.addTaskButton, { backgroundColor: theme.colors.primary }]}
        icon="plus"
      >
        Add Custom Task
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  plantImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  taskInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  plantName: {
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDate: {
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 16,
  },
  taskCardWrapper: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 24,
    paddingVertical: 8,
  },
});

export default CareScreen;
