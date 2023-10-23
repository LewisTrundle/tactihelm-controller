import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { styles, modalStyles }  from '../styles';

type AlertModalProps = {
  title?: string
  children?: any
  visible?: boolean
  onConfirm?: () => void | Promise<void> | Promise<boolean>
  onClose?: () => void
  allowClose?: boolean
  confirmText?: string
  cancelText?: string
};

export const AlertModal = ({title, children, visible, onConfirm, onClose, allowClose, confirmText, cancelText}: AlertModalProps) => {
  return (
    <Modal visible={visible} animationType='fade' onRequestClose={onClose} transparent={true} >
      <View style={modalStyles.container}>
        <Text style={modalStyles.titleText}>{title}</Text>
        {children}
        <View style={[modalStyles.buttons, !allowClose && styles.center]}>
          {allowClose && (
            <TouchableOpacity style={modalStyles.confirmButton} onPress={onClose}>
              <Text style={modalStyles.confirmButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={modalStyles.confirmButton} onPress={onConfirm}>
            <Text style={modalStyles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
};