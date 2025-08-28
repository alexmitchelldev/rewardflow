import React, { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { AlertButton, CustomAlert } from '../components/Alert';

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface UseAlertReturn {
  showAlert: (options: AlertOptions) => void;
  AlertComponent: () => React.JSX.Element | null;
}

export function useAlert(): UseAlertReturn {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    title: string;
    message?: string;
    buttons: AlertButton[];
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = useCallback((options: AlertOptions) => {
    const { title, message, buttons = [{ text: 'OK' }] } = options;

    // Use native Alert on mobile platforms
    if (Platform.OS !== 'web') {
      Alert.alert(
        title,
        message,
        buttons.map(button => ({
          text: button.text,
          onPress: button.onPress,
          style: button.style,
        }))
      );
      return;
    }

    // Use custom modal alert on web
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = useCallback(() => {
    // Only render the custom alert component on web
    if (Platform.OS !== 'web' || !alertState.visible) {
      return null;
    }

    return (
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={hideAlert}
      />
    );
  }, [alertState, hideAlert]);

  return {
    showAlert,
    AlertComponent,
  };
}