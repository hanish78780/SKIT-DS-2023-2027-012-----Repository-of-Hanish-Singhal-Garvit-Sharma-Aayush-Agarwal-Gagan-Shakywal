import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import {shadows} from '../../theme/tokens';

interface LoginScreenProps {
  onLoginSuccess: (driverId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const [driverId, setDriverId] = useState('DRV-001');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const trimmedDriverId = driverId.trim();

    if (!trimmedDriverId || !password) {
      setError('Please enter your Driver ID and password.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(trimmedDriverId);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header Branding */}
          <View style={styles.header}>
            <View style={styles.skitBadgeContainer}>
              <View style={styles.skitBadgeInner}>
                <Text style={styles.skitBadgeText}>SKIT</Text>
                <Text style={styles.skitBadgeSubtext}>JAIPUR</Text>
              </View>
            </View>
            <Text style={styles.appName}>UniTransit</Text>
            <Text style={styles.collegeName}>
              Swami Keshvanand Institute of Technology
            </Text>
            <Text style={styles.subtitle}>Driver Portal</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, shadows.medium]}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.description}>
              Sign in to manage your assigned campus bus & live trips.
            </Text>

            <Text style={styles.label}>Driver ID</Text>
            <TextInput
              value={driverId}
              onChangeText={value => {
                setDriverId(value);
                if (error) setError('');
              }}
              placeholder="e.g. DRV-001"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  if (error) setError('');
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.passwordInput}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowPassword(current => !current)}
                style={styles.showButton}>
                <Text style={styles.showText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <Pressable
              accessibilityRole="button"
              onPress={() => setError('Please contact SKIT Transport Cell to reset password.')}
              style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Authorized Transport Personnel Only • SKIT Jaipur
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  skitBadgeContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.skitMaroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: colors.skitGold,
  },
  skitBadgeInner: {
    alignItems: 'center',
  },
  skitBadgeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  skitBadgeSubtext: {
    color: colors.skitGold,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  appName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  collegeName: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  passwordRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  showButton: {
    paddingHorizontal: 14,
  },
  showText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 10,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: 22,
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: 14,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '500',
  },
});

export default LoginScreen;
