import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ListRenderItem,
  ScrollView,
  ImageSourcePropType,
  StyleProp,
  ImageStyle as RNImageStyle,
  ViewStyle as RNViewStyle,
  TextStyle as RNTextStyle,
  ImageURISource,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Searchbar,
  Chip,
  Card,
  Title,
  Paragraph,
  Button,
  useTheme as usePaperTheme,
  MD3Theme,
  MD3LightTheme,
  Text as PaperText,
  ButtonProps as PaperButtonProps,
  CardProps,
  ActivityIndicator,
  IconButton,
  DefaultTheme,
} from 'react-native-paper';

// Type definitions
type DiscoverItem = {
  id: string;
  type: 'plant' | 'article' | 'challenge';
  title: string;
  description: string;
  image: string;
  category?: string;
  likes?: number;
  author?: string;
  date?: string;
  participants?: number;
  scientificName?: string;
  readTime?: string;
  active?: boolean;
  name?: string;
};

type CategoryItem = {
  id: string;
  name: string;
};

// Component props
type DiscoverScreenProps = {
  // Add any props here if needed
};

// Create a custom theme type that extends MD3Theme
interface AppTheme extends Omit<MD3Theme, 'colors'> {
  colors: MD3Theme['colors'] & {
    onSurfaceVariant: string;
    surfaceVariant: string;
    onSurface: string;
    text: string;
    outline?: string;
  };
  roundness: number;
  animation: {
    scale: number;
  };
}

// Define the Plant type
type Plant = {
  id: string;
  name: string;
  scientificName: string;
  image: ImageURISource | string;
  location: string;
  date: string;
  category: string;
};

// Mock data for the screen
const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Rose',
    scientificName: 'Rosa',
    image: { uri: 'https://example.com/rose.jpg' },
    location: 'Garden',
    date: '2023-05-15',
    category: 'Flowers',
  },
  {
    id: '2',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    image: { uri: 'https://example.com/sunflower.jpg' },
    location: 'Field',
    date: '2023-06-20',
    category: 'Wildflowers',
  },
  {
    id: '3',
    name: 'Tulip',
    scientificName: 'Tulipa',
    image: { uri: 'https://example.com/tulip.jpg' },
    location: 'Garden',
    date: '2023-04-10',
    category: 'Bulbs',
  },
];

// Create a type-safe style sheet with proper type assertions
const makeStyles = (theme: MD3Theme) => {
  const cardElevation = 2;
  const cardBorderRadius = 8;
  const cardBackgroundColor = theme.colors.surface;
  const cardBorderColor = theme.dark ? '#444' : '#e0e0e0';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline || '#e0e0e0',
    },
    searchBar: {
      marginBottom: 16,
      elevation: 0,
      backgroundColor: theme.colors.surfaceVariant,
    },
    categoriesContainer: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline || '#e0e0e0',
    },
    categoriesList: {
      paddingHorizontal: 16,
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
    },
    categoryChip: {
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: 'transparent',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    listContent: {
      padding: 16,
    },
    card: {
      marginBottom: 16,
      borderRadius: cardBorderRadius,
      elevation: cardElevation,
      backgroundColor: cardBackgroundColor,
      overflow: 'hidden',
    },
    cardCover: {
      height: 200,
      borderTopLeftRadius: cardBorderRadius,
      borderTopRightRadius: cardBorderRadius,
    },
    cardImage: {
      width: '100%',
      height: 200,
    },
    cardImageContainer: {
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    cardContent: {
      padding: 16,
    },
    cardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 8,
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    metaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    metaText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      opacity: 0.7,
    },
    likesContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    actionButton: {
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 16,
      color: theme.colors.onSurfaceVariant,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    identifyButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      backgroundColor: theme.colors.primary,
    },
  });
};

// Define the styles with the theme
const defaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2e7d32',
    onPrimary: '#ffffff',
    primaryContainer: '#a5d6a7',
    onPrimaryContainer: '#00210b',
    secondary: '#53634e',
    onSecondary: '#ffffff',
    secondaryContainer: '#d7e8cd',
    onSecondaryContainer: '#121f0e',
    tertiary: '#38656a',
    onTertiary: '#ffffff',
    tertiaryContainer: '#bcebff',
    onTertiaryContainer: '#001f24',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    background: '#fafdf7',
    onBackground: '#1a1c19',
    surface: '#fafdf7',
    onSurface: '#1a1c19',
    surfaceVariant: '#dee5d9',
    onSurfaceVariant: '#424940',
    outline: '#72796f',
    outlineVariant: '#c2c9bd',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2f312d',
    inverseOnSurface: '#f0f1eb',
    inversePrimary: '#8bc34a',
    elevation: {
      level0: 'transparent',
      level1: '#f7f9f2',
      level2: '#f2f5ed',
      level3: '#edf0e8',
      level4: '#ebefe7',
      level5: '#e8ece4',
    },
    surfaceDisabled: 'rgba(26, 28, 25, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 25, 0.38)',
    backdrop: 'rgba(43, 50, 41, 0.4)',
    text: '#1a1c19',
  },
  roundness: 4,
  animation: {
    scale: 1,
  },
  dark: false,
} as const;

const styles = makeStyles(defaultTheme);

// Mock data for discovery feed
const mockDiscoverItems = [
  {
    id: '1',
    type: 'article',
    title: '10 Easy Houseplants for Beginners',
    description: 'Discover the best low-maintenance plants for your home',
    image: 'https://example.com/houseplants-article.jpg',
    category: 'Guides',
    readTime: '5 min read',
  },
  {
    id: '2',
    type: 'plant',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: 'https://example.com/monstera.jpg',
    category: 'Trending',
    likes: 1243,
  },
  {
    id: '3',
    type: 'challenge',
    title: '30-Day Plant Parent Challenge',
    description: 'Join thousands of plant lovers in our monthly challenge',
    image: 'https://example.com/challenge.jpg',
    participants: 5432,
    active: true,
  },
];

// Categories for discovery
const categories = [
  { id: 'all', name: 'All' },
  { id: 'trending', name: 'Trending' },
  { id: 'guides', name: 'Guides' },
  { id: 'challenges', name: 'Challenges' },
  { id: 'community', name: 'Community' },
];

const DiscoverScreen: React.FC = () => {
  const theme = usePaperTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [plants, setPlants] = useState<Plant[]>(mockPlants);
  const [refreshing, setRefreshing] = useState(false);

  // Filter plants based on search query and selected category
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch =
        searchQuery === '' ||
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || plant.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [plants, searchQuery, selectedCategory]);

  const handleIdentifyPress = () => {
    // Handle identify button press
    console.log('Identify button pressed');
  };

  const renderPlantCard = ({ item }: { item: Plant }) => (
    <Card style={styles.card}>
      <Card.Cover source={item.image} style={styles.cardCover} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.likesContainer}>
            <IconButton icon="heart-outline" size={20} onPress={() => {}} />
          </View>
        </View>
        <Text style={styles.subtitle}>{item.scientificName}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            {item.location} • {item.date}
          </Text>
          <IconButton icon="share-variant" size={20} onPress={() => {}} />
        </View>
      </Card.Content>
    </Card>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderDiscoverItem = ({ item }: { item: (typeof mockDiscoverItems)[0] }) => {
    // Define styles with proper typing
    const cardStyle: ViewStyle = {
      ...styles.card,
      backgroundColor: theme.colors.surface,
    };

    const cardImageStyle: ImageStyle = {
      ...styles.cardImage,
      height: 200,
    };

    const categoryChipStyle: ViewStyle = {
      ...styles.categoryChip,
      borderColor: theme.colors.primary,
    };

    const categoryTextStyle: TextStyle = {
      ...styles.metaText,
      color: theme.colors.primary,
      fontSize: 12,
    };

    const metaTextStyle: TextStyle = {
      ...styles.metaText,
      color: theme.colors.onSurfaceVariant,
    };

    const identifyButtonStyle: ViewStyle = {
      ...styles.identifyButton,
      backgroundColor: theme.colors.primary,
    };

    const titleStyle: TextStyle = {
      ...styles.itemTitle,
      color: paperTheme.colors.onSurface,
    };

    const descriptionStyle: TextStyle = {
      color: theme.colors.onSurfaceVariant,
    };

    const actionButtonStyle = styles.actionButton;

    if (item.type === 'article' || item.type === 'challenge') {
      return (
        <Card style={cardStyle}>
          <View style={{ height: 200, overflow: 'hidden' }}>
            <Image
              source={{ uri: item.image }}
              style={[styles.cardImage as ImageStyle, { height: 200 }]}
              resizeMode="cover"
            />
          </View>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Chip mode="outlined" style={categoryChipStyle} textStyle={categoryTextStyle}>
                {item.category}
              </Chip>
              {item.type === 'article' && <Text style={metaTextStyle}>{item.readTime}</Text>}
              {item.type === 'challenge' && (
                <Text style={[metaTextStyle, { color: paperTheme.colors.primary }]}>
                  {item.participants?.toLocaleString() || '0'} participants
                </Text>
              )}
            </View>
            <Title style={titleStyle}>{item.title}</Title>
            <Paragraph style={descriptionStyle}>{item.description}</Paragraph>
            <Button
              mode="contained"
              onPress={() => {}}
              style={identifyButtonStyle}
              labelStyle={{ color: paperTheme.colors.onPrimary }}
            >
              {item.type === 'article' ? 'Read Article' : 'Join Challenge'}
            </Button>
          </Card.Content>
        </Card>
      );
    }

    // Plant item
    return (
      <Card style={[styles.card as any, { backgroundColor: paperTheme.colors.surface }]}>
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        </View>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Chip mode="outlined" style={categoryChipStyle} textStyle={categoryTextStyle}>
              {item.category}
            </Chip>
            <View style={styles.likesContainer}>
              <Text style={metaTextStyle}>{item.likes?.toLocaleString() || '0'} likes</Text>
            </View>
          </View>
          <Title style={titleStyle}>{item.name}</Title>
          <Paragraph style={[descriptionStyle, { marginBottom: 12 }]}>
            {item.scientificName}
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => {}}
            style={identifyButtonStyle}
            labelStyle={{ color: 'white' }}
          >
            Identify
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderCategoryChip = (item: { id: string; name: string }) => {
    const isSelected = selectedCategory === item.id;

    return (
      <Chip
        key={item.id}
        mode={isSelected ? 'flat' : 'outlined'}
        selected={isSelected}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
        style={[
          styles.categoryChip,
          isSelected &&
            ({
              backgroundColor: theme.colors.primaryContainer || '#e8f5e9',
              borderColor: theme.colors.primaryContainer || '#e8f5e9',
            } as ViewStyle),
        ]}
        textStyle={
          {
            color: isSelected
              ? theme.colors.onPrimaryContainer || '#1b5e20'
              : theme.colors.onSurfaceVariant || '#666',
            fontSize: 12,
          } as TextStyle
        }
      >
        {item.name}
      </Chip>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Searchbar
          placeholder="Search plants, articles, and more"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurfaceVariant}
          icon="magnify"
          clearIcon={searchQuery ? 'close' : undefined}
          onIconPress={() => {}}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => renderCategoryChip(item)}
          keyExtractor={(item) => item.id}
        />
      </View>

      <FlatList
        data={mockDiscoverItems}
        renderItem={renderDiscoverItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
              No items found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default DiscoverScreen;
