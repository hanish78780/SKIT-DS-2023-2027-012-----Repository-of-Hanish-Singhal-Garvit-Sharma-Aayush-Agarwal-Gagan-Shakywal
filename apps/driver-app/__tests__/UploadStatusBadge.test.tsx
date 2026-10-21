/**
 * UploadStatusBadge.test.tsx
 *
 * Unit tests for the UploadStatusBadge component.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import UploadStatusBadge from '../src/components/UploadStatusBadge';
import { LocationUploadStatus } from '../src/types/driver';

const ALL_UPLOAD_STATUSES: LocationUploadStatus[] = [
  'idle',
  'uploading',
  'synced',
  'retry_pending',
  'error',
];

function getAllText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getAllText).join('');
  if (node.children) return node.children.map(getAllText).join('');
  return '';
}

describe('UploadStatusBadge', () => {
  it.each(ALL_UPLOAD_STATUSES)('renders without crashing for status "%s"', status => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UploadStatusBadge status={status} />);
    });
    expect(renderer!.toJSON()).not.toBeNull();
  });

  it('shows "Server Synced" when status is "synced"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UploadStatusBadge status="synced" />);
    });
    const text = getAllText(renderer!.toJSON());
    expect(text).toContain('Server Synced');
  });

  it('shows "Uploading…" when status is "uploading"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UploadStatusBadge status="uploading" />);
    });
    const text = getAllText(renderer!.toJSON());
    expect(text).toContain('Uploading…');
  });

  it('shows "Reconnecting…" when status is "retry_pending"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UploadStatusBadge status="retry_pending" />);
    });
    const text = getAllText(renderer!.toJSON());
    expect(text).toContain('Reconnecting…');
  });

  it('shows "Sync Failed" when status is "error"', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UploadStatusBadge status="error" />);
    });
    const text = getAllText(renderer!.toJSON());
    expect(text).toContain('Sync Failed');
  });
});
