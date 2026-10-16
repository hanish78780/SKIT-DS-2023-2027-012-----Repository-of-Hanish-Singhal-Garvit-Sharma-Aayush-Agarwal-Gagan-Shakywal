import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import MockApiService from '../src/services/mockApi';
import NotificationsScreen from '../src/screens/notifications/NotificationsScreen';
import HomeScreen from '../src/screens/home/HomeScreen';
import NotificationCard from '../src/components/NotificationCard';
import StudentHeader from '../src/components/StudentHeader';
import { mockNotifications } from '../src/data/mockData';

describe('Mock notification session state', () => {
  let service: typeof MockApiService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.isolateModules(() => {
      service = require('../src/services/mockApi').default;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fetchNotifications = async () => {
    const pending = service.getNotifications();
    jest.advanceTimersByTime(300);
    return pending;
  };

  test('marking one notification remains read on subsequent fetches', async () => {
    const before = await fetchNotifications();
    const unread = before.find(item => !item.isRead)!;

    const updated = service.markNotificationRead(unread.id);
    expect(updated.find(item => item.id === unread.id)?.isRead).toBe(true);
    const after = await fetchNotifications();

    expect(after.find(item => item.id === unread.id)?.isRead).toBe(true);
    expect(before.find(item => item.id === unread.id)?.isRead).toBe(false);
    expect(mockNotifications.find(item => item.id === unread.id)?.isRead).toBe(false);
  });

  test('marking all notifications remains read on subsequent fetches', async () => {
    expect((await fetchNotifications()).some(item => !item.isRead)).toBe(true);

    const updated = service.markAllNotificationsRead();
    expect(updated.every(item => item.isRead)).toBe(true);
    expect((await fetchNotifications()).every(item => item.isRead)).toBe(true);
  });

  test('returned arrays and notification objects cannot mutate the session state', async () => {
    const first = await fetchNotifications();
    const originalTitle = first[0].title;
    first[0].title = 'Changed by a screen';
    first.pop();

    const next = await fetchNotifications();
    expect(next).toHaveLength(mockNotifications.length);
    expect(next[0].title).toBe(originalTitle);

    const marked = service.markAllNotificationsRead();
    marked[0].isRead = false;
    marked.pop();
    const final = await fetchNotifications();
    expect(final).toHaveLength(mockNotifications.length);
    expect(final.every(item => item.isRead)).toBe(true);
  });
});

describe('Notification screen read state across navigation', () => {
  let component: ReactTestRenderer;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await act(async () => {
      component.unmount();
    });
    jest.useRealTimers();
  });

  const flushLoading = async () => {
    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });
  };

  test('mark all read survives screen remounts and clears the Home unread count', async () => {
    await act(async () => {
      component = renderer.create(<NotificationsScreen />);
    });
    await flushLoading();
    expect(component.root.findAllByType(NotificationCard).some(
      card => !card.props.notification.isRead
    )).toBe(true);

    await act(async () => {
      component.root.findAllByProps({ accessibilityLabel: 'Mark all read' })[0].props.onPress();
    });
    expect(component.root.findAllByType(NotificationCard).every(
      card => card.props.notification.isRead
    )).toBe(true);

    await act(async () => {
      component.update(<HomeScreen
        onNavigateTrack={jest.fn()}
        onNavigateRoute={jest.fn()}
        onNavigateBusDetails={jest.fn()}
        onNavigateNotifications={jest.fn()}
        onNavigateReportIssue={jest.fn()}
        onNavigateHelp={jest.fn()}
        onNavigateProfile={jest.fn()}
      />);
    });
    await flushLoading();
    expect(component.root.findByType(StudentHeader).props.unreadNotificationsCount).toBe(0);

    await act(async () => {
      component.update(<NotificationsScreen />);
    });
    await flushLoading();
    const cards = component.root.findAllByType(NotificationCard);
    expect(cards).toHaveLength(mockNotifications.length);
    expect(cards.every(card => card.props.notification.isRead)).toBe(true);
  });
});
