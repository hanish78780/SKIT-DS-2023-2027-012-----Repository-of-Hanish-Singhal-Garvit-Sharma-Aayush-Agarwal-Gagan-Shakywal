/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  let component: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<App />);
  });
  await ReactTestRenderer.act(() => {
    component.unmount();
  });
});
