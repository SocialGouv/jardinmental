import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MyText from '../../src/components/MyText';

// Helper pour créer les props par défaut
const createDefaultProps = (overrides = {}) => ({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  p: false,
  bold: false,
  italic: false,
  children: 'Test Text',
  style: {},
  ...overrides
});

describe('MyText Component', () => {
  test('should render text correctly', () => {
    const props = createDefaultProps({ children: 'Hello World' });

    render(<MyText {...props} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  test('should apply default styles', () => {
    const props = createDefaultProps();

    const { getByText } = render(<MyText {...props} />);
    const textElement = getByText('Test Text');

    // Vérifier que les styles par défaut sont appliqués
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontFamily: 'SourceSans3',
          color: '#111'
        })
      ])
    );
  });

  test('should accept custom styles', () => {
    const customStyle = { fontSize: 20, color: 'red' };
    const props = createDefaultProps({
      children: 'Styled Text',
      style: customStyle
    });

    const { getByText } = render(<MyText {...props} />);
    const textElement = getByText('Styled Text');

    expect(textElement).toBeTruthy();
    // Vérifier que les styles personnalisés sont appliqués
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontFamily: 'SourceSans3',
          color: '#111'
        }),
        customStyle
      ])
    );
  });

  test('should pass through other props', () => {
    const props = createDefaultProps({
      children: 'Props Test',
      testID: 'my-text',
      accessibilityLabel: 'Test label'
    });

    const { getByText } = render(<MyText {...props} />);
    const textElement = getByText('Props Test');

    expect(textElement.props.testID).toBe('my-text');
    expect(textElement.props.accessibilityLabel).toBe('Test label');
  });
});
