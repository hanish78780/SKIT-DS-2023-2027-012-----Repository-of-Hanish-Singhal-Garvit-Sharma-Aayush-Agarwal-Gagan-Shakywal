/**
 * GpsStatusBadge.test.tsx
 *
 * Snapshot + rendering tests for the GpsStatusBadge component.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import GpsStatusBadge from '../src/components/GpsStatusBadge';
import {LocationStatus} from '../src/types/driver';

const ALL_STATUSES: LocationStatus[] = [
  'idle',
  'requesting_permission',
  'permission_denied',
  'permission_blocked',
  'location_unavailable',
  'acquiring_location',
  'tracking',
  'error',
];

describe('GpsStatusBadge', () => {
  it.each(ALL_STATUSES)('renders without crash for status "%s"', status => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<GpsStatusBadge status={status} />);
    });
    expect(renderer!.toJSON()).not.toBeNull();
  });

  it('shows "Active" label when status is "tracking"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<GpsStatusBadge status="tracking" />);
    });
    const json = renderer!.toJSON() as any;
    const allText = getAllText(json);
    expect(allText).toContain('GPS: Active');
  });

  it('shows "Permission Required" when status is "permission_denied"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <GpsStatusBadge status="permission_denied" />,
      );
    });
    const json = renderer!.toJSON() as any;
    const allText = getAllText(json);
    expect(allText).toContain('GPS: Permission Required');
  });

  it('shows "Location Unavailable" when status is "location_unavailable"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <GpsStatusBadge status="location_unavailable" />,
      );
    });
    const json = renderer!.toJSON() as any;
    const allText = getAllText(json);
    expect(allText).toContain('GPS: Location Unavailable');
  });
});

/** Recursively gather all text children from a rendered JSON tree. */
function getAllText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getAllText).join('');
  if (node.children) return node.children.map(getAllText).join('');
  return '';
}
