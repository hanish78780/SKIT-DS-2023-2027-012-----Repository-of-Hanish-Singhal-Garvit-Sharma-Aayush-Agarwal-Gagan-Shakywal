import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📋',
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default EmptyState;
