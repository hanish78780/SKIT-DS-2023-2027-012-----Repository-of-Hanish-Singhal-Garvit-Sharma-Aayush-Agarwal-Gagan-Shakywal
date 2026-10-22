import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import App from '../App';
import LoginScreen from '../src/screens/auth/LoginScreen';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

describe('Student App Smoke Test', () => {
  test('renders App component without crashing', async () => {
    let component!: ReactTestRenderer;
    await act(async () => {
      component = renderer.create(<App />);
    });
    expect(component.toJSON()).not.toBeNull();
    expect(component.root.findAllByType(LoginScreen)).toHaveLength(1);
    await act(async () => {
      component.unmount();
    });
  });
});
