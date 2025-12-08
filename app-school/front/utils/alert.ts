import { Alert } from 'react-native';

interface AlertOptions {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function showAlert(
  title: string,
  message: string,
  onConfirm?: () => void,
  onCancel?: () => void
) {
  if (onConfirm) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'OK',
          onPress: onConfirm,
        },
      ]
    );
  } else {
    Alert.alert(title, message);
  }
}

export function showConfirmAlert(options: AlertOptions) {
  Alert.alert(
    options.title,
    options.message,
    [
      {
        text: options.cancelText || 'Cancelar',
        style: 'cancel',
        onPress: options.onCancel,
      },
      {
        text: options.confirmText || 'Confirmar',
        onPress: options.onConfirm,
      },
    ]
  );
}