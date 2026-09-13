import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Student} from '../types/driver';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';
import StatusBadge from './StatusBadge';

interface StudentCardProps {
  student: Student;
  onToggleStatus?: (studentId: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onToggleStatus,
}) => {
  const isBoarded = student.status === 'BOARDED';

  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: isBoarded ? colors.successBg : colors.primaryBg},
          ]}>
          <Text
            style={[
              styles.avatarText,
              {color: isBoarded ? colors.success : colors.primary},
            ]}>
            {student.name[0]}
          </Text>
        </View>

        <View style={styles.infoGroup}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName}>{student.name}</Text>
            <StatusBadge status={student.status} />
          </View>
          <Text style={styles.rollNumber}>Roll: {student.rollNumber}</Text>
          <Text style={styles.stopName}>
            📍 {student.stopName} ({student.pickupTime})
          </Text>
        </View>
      </View>

      {onToggleStatus && (
        <Pressable
          accessibilityRole="button"
          onPress={() => onToggleStatus(student.id)}
          style={({pressed}) => [
            styles.toggleBtn,
            isBoarded ? styles.toggleBtnBoarded : styles.toggleBtnWaiting,
            pressed && styles.pressed,
          ]}>
          <Text
            style={[
              styles.toggleBtnText,
              {color: isBoarded ? colors.textSecondary : colors.white},
            ]}>
            {isBoarded ? 'Mark Waiting' : 'Mark Boarded ✓'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  infoGroup: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  studentName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rollNumber: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  stopName: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  toggleBtn: {
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleBtnWaiting: {
    backgroundColor: colors.primary,
  },
  toggleBtnBoarded: {
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default StudentCard;
