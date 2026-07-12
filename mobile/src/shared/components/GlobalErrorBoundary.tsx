import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PocketText } from './PocketText';
import { PocketButton } from './PocketButton';
import { Icon } from './Icon';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // In production, log to Sentry or Datadog here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="AlertTriangle" size={48} color={colors.light.error} />
            </View>
            <PocketText variant="heading4" weight="bold" align="center" style={styles.title}>
              Something went wrong
            </PocketText>
            <PocketText variant="bodyMedium" color={colors.light.textSecondary} align="center" style={styles.message}>
              We've hit an unexpected error. Our team has been notified.
            </PocketText>
            <PocketButton 
              title="Try Again" 
              onPress={this.handleReset} 
              variant="outline"
              style={styles.button}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.md,
  },
  message: {
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
});
