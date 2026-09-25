import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { HelpContact, FAQItem } from '../../types';

export const HelpSafetyScreen: React.FC = () => {
  const [contacts, setContacts] = useState<HelpContact[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_01');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cData, fData] = await Promise.all([
          MockApiService.getHelpContacts(),
          MockApiService.getFAQs(),
        ]);
        setContacts(cData);
        setFaqs(fData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading SKIT transport help contacts..." />;
  }

  const handleCall = (phone: string, title: string) => {
    Alert.alert(`Call ${title}`, `Dial ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Safety Center</Text>
        <Text style={styles.subtitle}>
          SKIT Jaipur Transport Support & Emergency Assistance
        </Text>
      </View>

      {/* Emergency Banner */}
      <View style={[styles.emergencyBanner, shadows.sm]}>
        <View style={styles.emergencyIconCircle}>
          <Text style={styles.emergencyIcon}>🚨</Text>
        </View>
        <View style={styles.emergencyTextCol}>
          <Text style={styles.emergencyTitle}>Campus 24/7 Safety Helpline</Text>
          <Text style={styles.emergencySub}>In case of emergency during bus transit</Text>
        </View>
        <Pressable
          onPress={() => handleCall('+91 141 2752165', 'College Emergency Room')}
          style={styles.emergencyCallBtn}>
          <Text style={styles.emergencyCallText}>CALL NOW</Text>
        </Pressable>
      </View>

      {/* Transport Contacts */}
      <Text style={styles.sectionHeader}>Transport Office Contacts</Text>
      {contacts.map(contact => (
        <View key={contact.id} style={[styles.contactCard, shadows.sm]}>
          <View style={styles.contactLeft}>
            <Text style={styles.contactTitle}>{contact.title}</Text>
            <Text style={styles.contactDept}>{contact.department}</Text>
            <Text style={styles.contactHours}>🕒 {contact.availableHours}</Text>
          </View>
          <Pressable
            onPress={() => handleCall(contact.phone, contact.title)}
            style={styles.callIconBtn}>
            <Text style={styles.callIconText}>📞</Text>
          </Pressable>
        </View>
      ))}

      {/* Frequently Asked Questions */}
      <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
      {faqs.map(faq => {
        const isExpanded = expandedFaqId === faq.id;
        return (
          <Pressable
            key={faq.id}
            onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
            style={[styles.faqCard, shadows.sm]}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqChevron}>{isExpanded ? '▲' : '▼'}</Text>
            </View>
            {isExpanded && (
              <View style={styles.faqBody}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
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
  emergencyBanner: {
    backgroundColor: colors.errorLight,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 20,
    gap: 12,
  },
  emergencyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIcon: {
    fontSize: 22,
  },
  emergencyTextCol: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.errorDark,
  },
  emergencySub: {
    fontSize: 11,
    color: colors.errorDark,
    marginTop: 2,
    opacity: 0.9,
  },
  emergencyCallBtn: {
    backgroundColor: colors.errorDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emergencyCallText: {
    color: colors.textInverted,
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactLeft: {
    flex: 1,
    paddingRight: 10,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  contactDept: {
    fontSize: 13,
    color: colors.primaryDark,
    marginTop: 1,
    fontWeight: '600',
  },
  contactHours: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  callIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  callIconText: {
    fontSize: 18,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    paddingRight: 8,
  },
  faqChevron: {
    fontSize: 12,
    color: colors.textMuted,
  },
  faqBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default HelpSafetyScreen;
