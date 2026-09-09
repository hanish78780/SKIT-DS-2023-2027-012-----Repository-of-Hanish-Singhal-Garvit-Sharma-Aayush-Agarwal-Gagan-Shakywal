import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import colors from '../../theme/colors';

const LoginScreen = () => {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const trimmedDriverId = driverId.trim();

    if (!trimmedDriverId || !password) {
      setError('Please enter your Driver ID and password.');
      return;
    }

    setError('');
    console.log('Driver login submitted', {driverId: trimmedDriverId});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>U</Text>
            </View>
            <Text style={styles.appName}>UniTransit</Text>
            <Text style={styles.subtitle}>Driver Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.description}>
              Sign in to manage your assigned bus and trips.
            </Text>

            <Text style={styles.label}>Driver ID</Text>
            <TextInput
              value={driverId}
              onChangeText={value => {
                setDriverId(value);
                if (error) setError('');
              }}
              placeholder="Enter your driver ID"
              placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
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

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Login"
              onPress={handleLogin}
              style={({pressed}) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => console.log('Forgot password pressed')}
              style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Need access? Contact the transport administrator.
          </Text>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  logoText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '700',
  },
  appName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 18,
  },
  passwordRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  showButton: {
    paddingHorizontal: 14,
  },
  showText: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 10,
  },
  loginButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  loginButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
  },
});

export default LoginScreen;
