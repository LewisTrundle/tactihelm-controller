import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { modalStyles }  from '../../styles';

type AlertModalProps = {
  title?: string
  children?: any
  visible?: boolean
  onConfirm?: () => void | Promise<void> | Promise<boolean>
  onClose?: () => void
  confirmText?: string
  cancelText?: string
  scrollable?: boolean
};

export const AlertModal = ({ title, children, visible, onConfirm, onClose, confirmText="Ok", cancelText="Cancel", scrollable=false }: AlertModalProps) => {
  const modalContent = (
    <View style={modalStyles.container}>
      <View style={modalStyles.content}>
        <Text style={modalStyles.titleText}>{title}</Text>
        {children}
        <View style={[modalStyles.buttons, (!onClose || !onConfirm) && modalStyles.center]}>
          {onClose && (
            <TouchableOpacity style={modalStyles.confirmButton} onPress={onClose}>
              <Text style={modalStyles.confirmButtonText}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity style={modalStyles.confirmButton} onPress={onConfirm}>
              <Text style={modalStyles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType='fade' onRequestClose={onClose} transparent={true} >
      {scrollable ? (
        <ScrollView>
          {modalContent}
        </ScrollView>
      ) : (
        modalContent
      )}
    </Modal>
  )
};