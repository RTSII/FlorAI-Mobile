import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { useTheme, Searchbar, FAB, Card, Title, Paragraph, Button } from 'react-native-paper';

// Mock data for the collection
const mockPlants = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: 'https://example.com/monstera.jpg',
    lastWatered: '2 days ago',
    nextWatering: 'in 5 days',
  },
  {
    id: '2',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://example.com/snake-plant.jpg',
    lastWatered: '1 week ago',
    nextWatering: 'in 1 week',
  },
];

const CollectionScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredPlants = mockPlants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderPlantCard = ({ item }: { item: (typeof mockPlants)[0] }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.cardContent}>
          <View style={styles.imagePlaceholder}>
            <Image
              source={{ uri: item.image }}
              style={styles.plantImage}
              defaultSource={require('../../assets/images/placeholder-plant.png')}
            />
          </View>
          <View style={styles.plantInfo}>
            <Title style={{ color: theme.colors.onSurface }}>{item.name}</Title>
            <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
              {item.scientificName}
            </Paragraph>
            <View style={styles.plantMeta}>
              <Paragraph style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                Last watered: {item.lastWatered}
              </Paragraph>
              <Paragraph style={[styles.metaText, { color: theme.colors.primary }]}>
                {item.nextWatering}
              </Paragraph>
            </View>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button onPress={() => {}}>View Details</Button>
        <Button onPress={() => {}}>Water Now</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search your collection..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
        />
      </View>

      <View style={styles.tabs}>
        <Button
          mode={activeTab === 'all' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('all')}
          style={styles.tab}
        >
          All Plants
        </Button>
        <Button
          mode={activeTab === 'needsCare' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('needsCare')}
          style={styles.tab}
        >
          Needs Care
        </Button>
        <Button
          mode={activeTab === 'favorites' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('favorites')}
          style={styles.tab}
        >
          Favorites
        </Button>
      </View>

      {filteredPlants.length > 0 ? (
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            {searchQuery ? 'No plants found' : 'Your collection is empty'}
          </Text>
          {!searchQuery && (
            <Button mode="contained" onPress={() => {}} style={styles.addButton}>
              Add Your First Plant
            </Button>
          )}
        </View>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {}}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    marginRight: 8,
    borderRadius: 20,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  plantInfo: {
    flex: 1,
  },
  plantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

export default CollectionScreen;
