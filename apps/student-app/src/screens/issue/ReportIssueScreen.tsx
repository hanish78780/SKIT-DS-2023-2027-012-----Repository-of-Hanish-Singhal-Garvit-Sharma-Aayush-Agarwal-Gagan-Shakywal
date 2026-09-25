import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import PrimaryButton from '../../components/PrimaryButton';
import MockApiService from '../../services/mockApi';
import { IssueCategory } from '../../types';

export const ReportIssueScreen: React.FC = () => {
  const [category, setCategory] = useState<IssueCategory>('Bus Delay');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const categories: IssueCategory[] = [
    'Bus Delay',
    'Bus Not Arrived',
    'Wrong Route',
    'Driver Issue',
    'Bus Condition',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please provide a brief description of the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await MockApiService.submitIssueReport({
        category,
        description,
        busNumber: 'RJ-14-AB-1234',
        routeNumber: 'Route 03',
        studentId: 'SKIT/2023/CS/012',
        timestamp: new Date().toISOString(),
      });
      setSubmittedTicketId(res.ticketId);
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Could not submit issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicketId(null);
    setDescription('');
    setCategory('Bus Delay');
  };

  if (submittedTicketId) {
    return (
      <View style={styles.successContainer}>
        <View style={[styles.successCard, shadows.lg]}>
          <View style={styles.successIconBadge}>
            <Text style={styles.successIconText}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Report Submitted!</Text>
          <Text style={styles.successSub}>
            Your transport issue has been logged with the SKIT Transport Office.
          </Text>

          <View style={styles.ticketBox}>
            <Text style={styles.ticketLabel}>TICKET REFERENCE NUMBER</Text>
            <Text style={styles.ticketId}>{submittedTicketId}</Text>
          </View>

          <PrimaryButton
            title="Report Another Issue"
            onPress={handleReset}
            style={styles.resetBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Report Transport Issue</Text>
        <Text style={styles.subtitle}>
          Help SKIT Administration keep campus transit prompt and safe.
        </Text>
      </View>

      {/* Select Category */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>Select Issue Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map(cat => {
            const isSelected = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Description Field */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Description of Issue
        </Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe what happened (e.g. Bus 03 delayed by 15 mins near Mansarovar)..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{description.length} / 500 characters</Text>

        <PrimaryButton
          title="Submit Report to Transport Desk"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          style={styles.submitBtn}
        />
      </View>

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          🔒 Reports are directly handled by Swami Keshwanand Institute of Technology Transport Committee. Emergency cases should call transport helpline directly.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextSelected: {
    color: colors.textInverted,
    fontWeight: '700',
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  charCount: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 4,
  },
  disclaimerBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  successIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  successSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketBox: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  ticketId: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  resetBtn: {
    width: '100%',
  },
});

export default ReportIssueScreen;
