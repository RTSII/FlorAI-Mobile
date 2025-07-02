# Card Component

The Card component is a versatile container that can be used to group related content and actions. It supports various visual styles through variants, sizes, and customization options.

## Features

- Multiple variants: elevated, outlined, filled, and image
- Configurable sizes: small, medium, and large
- Optional image header and footer sections
- Touchable interaction when `onPress` is provided
- Customizable styles for the card and its content

## Usage

```tsx
import { Card } from '@/components/surfaces/Card';

// Basic usage
<Card>
  <Text>Card content</Text>
</Card>

// With variant and size
<Card variant="outlined" size="large">
  <Text>Large outlined card</Text>
</Card>

// With image header and footer
<Card
  imageHeader={<Image source={require('@/assets/images/header.jpg')} />}
  footer={<Button title="Action" onPress={() => {}} />}
>
  <Text>Card with header and footer</Text>
</Card>

// With onPress handler
<Card onPress={() => console.log('Card pressed')}>
  <Text>Touchable card</Text>
</Card>
```

## Variants

The Card component supports the following variants:

- `elevated` (default): Card with elevation and shadow
- `outlined`: Card with a border outline
- `filled`: Card with a filled background color
- `image`: Card designed to display images with proper styling

### Variant Components

For convenience, the Card component exports variant-specific components:

```tsx
import { ElevatedCard, OutlinedCard, FilledCard, ImageCard } from '@/components/surfaces/Card';

// These are equivalent:
<Card variant="outlined">...</Card>
<OutlinedCard>...</OutlinedCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'elevated' \| 'outlined' \| 'filled' \| 'image'` | `'elevated'` | Visual style variant of the card |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the card |
| `children` | `ReactNode` | (required) | Content to render inside the card |
| `onPress` | `() => void` | `undefined` | Function to call when card is pressed |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Additional styles for the card container |
| `contentStyle` | `StyleProp<ViewStyle>` | `undefined` | Additional styles for the content container |
| `fullWidth` | `boolean` | `false` | Whether the card should take full width |
| `imageHeader` | `ReactNode` | `undefined` | Content to render as the card header |
| `footer` | `ReactNode` | `undefined` | Content to render as the card footer |

## Examples

### Basic Card

```tsx
<Card>
  <Text>Simple card with default styling</Text>
</Card>
```

### Card with Custom Styling

```tsx
<Card 
  style={{ backgroundColor: '#f0f0f0' }}
  contentStyle={{ padding: 24 }}
>
  <Text>Card with custom styling</Text>
</Card>
```

### Interactive Card

```tsx
<Card 
  onPress={() => alert('Card pressed')}
  variant="elevated"
  size="medium"
>
  <Text>Press this card</Text>
</Card>
```

### Card with Image Header

```tsx
<ImageCard
  imageHeader={
    <Image 
      source={require('@/assets/images/plant.jpg')}
      style={{ width: '100%', height: 200 }}
    />
  }
>
  <Text style={{ fontWeight: 'bold' }}>Plant Name</Text>
  <Text>Plant description and details</Text>
</ImageCard>
```

## Testing

The Card component includes comprehensive test coverage:

- Unit tests (`Card.test.tsx`)
- Integration tests (`Card.integration.test.tsx`)
- Snapshot tests (`Card.snapshot.test.tsx`)
