import React, {useEffect} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../theme/colors';

interface SplashScreenProps {
  onFinishSplash: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({onFinishSplash}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinishSplash();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinishSplash]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable onPress={onFinishSplash} style={styles.container}>
        <View style={styles.brandCircle}>
          <View style={styles.skitBadge}>
            <Text style={styles.skitBadgeText}>SKIT</Text>
            <Text style={styles.skitSubtext}>JAIPUR</Text>
          </View>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.title}>UniTransit</Text>
          <Text style={styles.collegeTitle}>
            Swami Keshvanand Institute of Technology
          </Text>
          <Text style={styles.subtitle}>Driver Transportation Portal</Text>
        </View>

        <View style={styles.busIllustration}>
          <Text style={styles.busEmoji}>🚌</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Initializing Driver Session...</Text>
        </View>

        <Text style={styles.footerNote}>Tap anywhere to skip</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  brandCircle: {
    marginTop: 20,
  },
  skitBadge: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: colors.skitMaroon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.skitGold,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  skitBadgeText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  skitSubtext: {
    color: colors.skitGold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: -3,
  },
  textGroup: {
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  collegeTitle: {
    color: colors.primaryBg,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  busIllustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busEmoji: {
    fontSize: 50,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  footerNote: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '500',
  },
});

export default SplashScreen;
