import React from 'react';
import renderer from 'react-test-renderer';
import { Card } from '../Card.tsx';
import { PaperProvider } from 'react-native-paper';

// Import types for React Test Renderer
import type { ReactTestRendererJSON } from 'react-test-renderer';

// Type for the Card component with static properties
interface CardWithStatics extends React.FC<React.ComponentProps<typeof Card>> {
  Content: React.FC<{ 
    children: React.ReactNode; 
    style?: Record<string, unknown> 
  }>;
  Title: React.FC<{ 
    title: string; 
    subtitle?: string;
    titleStyle?: Record<string, unknown>;
    subtitleStyle?: Record<string, unknown>;
    titleNumberOfLines?: number;
    subtitleNumberOfLines?: number;
    left?: (props: { size: number }) => React.ReactNode;
    right?: (props: { size: number }) => React.ReactNode;
  }>;
}

// Cast the imported Card to include static properties
const TypedCard = Card as unknown as CardWithStatics;

// Type declarations for Jest globals
type JestDoneCallback = (reason?: string | Error) => void;

type JestMatcherResult = {
  message: () => string;
  pass: boolean;
};

type JestMatchers<T> = {
  toMatchSnapshot: () => JestMatcherResult;
  toBeDefined: () => JestMatcherResult;
  toBe: (expected: T) => JestMatcherResult;
  // Add other matchers as needed
};

type JestExpect = {
  <T = unknown>(actual: T): JestMatchers<T>;
  // Add other matcher types as needed
};

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: (done?: JestDoneCallback) => void | Promise<void>) => void;
declare const expect: JestExpect;

describe('Card Snapshot Tests', () => {
  it('renders default card correctly', () => {
    const tree = renderer
      .create(
        <PaperProvider>
          <TypedCard testID="default-card">
            <TypedCard.Content>
              <TypedCard.Title title="Test Card" />
              <TypedCard.Content>Test Content</TypedCard.Content>
            </TypedCard.Content>
          </TypedCard>
        </PaperProvider>
      )
      .toJSON() as ReactTestRendererJSON | null;
    
    expect(tree).toMatchSnapshot();
  });

  it('renders outlined variant correctly', () => {
    const tree = renderer
      .create(
        <PaperProvider>
          <TypedCard variant="outlined" testID="outlined-card">
            <TypedCard.Content>
              <TypedCard.Title title="Outlined Card" />
              <TypedCard.Content>Outlined content</TypedCard.Content>
            </TypedCard.Content>
          </TypedCard>
        </PaperProvider>
      )
      .toJSON() as ReactTestRendererJSON | null;
    
    expect(tree).toMatchSnapshot();
  });

  it('renders with custom styles correctly', () => {
    const tree = renderer
      .create(
        <PaperProvider>
          <TypedCard 
            style={{ backgroundColor: '#f0f0f0' }}
            contentStyle={{ padding: 16 }}
            testID="styled-card"
          >
            <TypedCard.Content>
              <TypedCard.Title title="Styled Card" />
              <TypedCard.Content>Custom styled content</TypedCard.Content>
            </TypedCard.Content>
          </TypedCard>
        </PaperProvider>
      )
      .toJSON() as ReactTestRendererJSON | null;
    
    expect(tree).toMatchSnapshot();
  });
});
