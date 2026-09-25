import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';

describe('Student App Smoke Test', () => {
  test('renders App component without crashing', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(<App />).toJSON();
    });
    expect(tree).toBeDefined();
  });
});
