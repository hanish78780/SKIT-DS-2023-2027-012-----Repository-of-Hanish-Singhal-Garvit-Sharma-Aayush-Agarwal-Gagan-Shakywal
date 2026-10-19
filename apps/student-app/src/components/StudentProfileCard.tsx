import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import { StudentProfile } from '../types';

interface StudentProfileCardProps {
  student: StudentProfile;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ student }) => {
  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.headerRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentId}>{student.studentId}</Text>
          <Text style={styles.course}>{student.course}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>College</Text>
          <Text style={styles.value} numberOfLines={1}>
            SKIT Jaipur
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Year / Sem</Text>
          <Text style={styles.value}>{student.year}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Assigned Bus</Text>
          <Text style={styles.valueHighlight}>{student.assignedBusNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textInverted,
  },
  titleCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  studentId: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: 1,
  },
  course: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  valueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default StudentProfileCard;
