import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../theme/colors';
import { StudentProfile } from '../types';

interface StudentHeaderProps {
  student: StudentProfile;
  unreadNotificationsCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  unreadNotificationsCount = 0,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        <Pressable onPress={onProfilePress} style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {student.name.charAt(0).toUpperCase()}
          </Text>
        </Pressable>

        <View>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text style={styles.studentName}>{student.name}</Text>
          <View style={styles.collegeBadge}>
            <Text style={styles.collegeBadgeText}>SKIT Jaipur Transport</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={onNotificationPress} style={styles.bellButton}>
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadNotificationsCount > 0 && (
          <View style={styles.badgeDot}>
            <Text style={styles.badgeText}>
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textInverted,
    fontSize: 18,
    fontWeight: '700',
  },
  greetingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  collegeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  collegeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellIcon: {
    fontSize: 18,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverted,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default StudentHeader;
