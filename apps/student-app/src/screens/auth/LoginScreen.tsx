import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import PrimaryButton from '../../components/PrimaryButton';
import MockApiService from '../../services/mockApi';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('SKIT/2023/CS/012');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!studentId.trim()) {
      setError('Please enter your Student ID or College Email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await MockApiService.loginStudent(studentId, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact SKIT Transport Office or Admin Desk to reset your transport portal password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🚌</Text>
          </View>
          <Text style={styles.appName}>UniTransit</Text>
          <Text style={styles.collegeName}>
            Swami Keshwanand Institute of Technology & Management
          </Text>
          <Text style={styles.campusTag}>SKIT Jaipur • Student Portal</Text>
        </View>

        <View style={[styles.card, shadows.md]}>
          <Text style={styles.title}>Welcome back, Student!</Text>
          <Text style={styles.subtitle}>
            Sign in to track your assigned college bus & live ETA.
          </Text>

          <Text style={styles.label}>Student ID / College Email</Text>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={val => {
              setStudentId(val);
              if (error) setError('');
            }}
            placeholder="e.g. SKIT/2023/CS/012 or student@skit.ac.in"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={val => {
                setPassword(val);
                if (error) setError('');
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.showButton}>
              <Text style={styles.showButtonText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.forgotRow}>
            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <PrimaryButton
            title="Sign In to Student App"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.demoNote}>
            <Text style={styles.demoNoteText}>
              💡 Demo Mode active for SKIT Jaipur testing.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            UniTransit v1.0.0 • SKIT Transport Management
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D0E1FF',
  },
  logoIcon: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  collegeName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
  campusTag: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    height: '100%',
  },
  showButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  showButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  loginButton: {
    marginTop: 4,
  },
  demoNote: {
    marginTop: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
  },
  demoNoteText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default LoginScreen;
