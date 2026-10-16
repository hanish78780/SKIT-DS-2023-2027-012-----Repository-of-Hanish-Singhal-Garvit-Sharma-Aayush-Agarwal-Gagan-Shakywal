/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import LoginScreen from '../src/screens/auth/LoginScreen';
import DashboardScreen from '../src/screens/dashboard/DashboardScreen';
import { Alert, TextInput } from 'react-native';

test.each([
  ['', 'DRV-104'],
  ['   ', 'DRV-104'],
  ['  DRV-205  ', 'DRV-205'],
])(
  'opens dashboard without authentication for ID %p',
  async (input, expected) => {
    let app!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      app = ReactTestRenderer.create(<App />);
    });

    expect(app.root.findAllByType(DashboardScreen)).toHaveLength(0);
    expect(app.root.findAllByType(TextInput)).toHaveLength(1);
    await ReactTestRenderer.act(async () => {
      app.root.findByType(TextInput).props.onChangeText(input);
    });
    await ReactTestRenderer.act(async () => {
      app.root
        .findAll(node => typeof node.props.onPress === 'function')
        .find(button => button.props.accessibilityLabel === 'Login')!
        .props.onPress();
    });
    expect(app.root.findByType(DashboardScreen).props.driverId).toBe(expected);
    expect(app.root.findAllByType(LoginScreen)).toHaveLength(0);

    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    try {
      await ReactTestRenderer.act(async () => {
        app.root
          .findAll(node => typeof node.props.onPress === 'function')
          .find(button => button.props.accessibilityLabel === 'Log out')!
          .props.onPress();
      });
      const buttons = alert.mock.calls[0][2]!;
      await ReactTestRenderer.act(async () => {
        buttons.find(button => button.text === 'Log Out')!.onPress!();
      });
      expect(app.root.findAllByType(LoginScreen)).toHaveLength(1);
      expect(app.root.findAllByType(DashboardScreen)).toHaveLength(0);
      expect(app.root.findByType(TextInput).props.value).toBe('');
    } finally {
      alert.mockRestore();
      await ReactTestRenderer.act(async () => app.unmount());
    }
  },
);
