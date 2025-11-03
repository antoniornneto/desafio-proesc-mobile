import { View, Modal, Text, TouchableOpacity } from 'react-native';

type AndroidWarningProps = {
  visible: boolean;
  onClose: () => void;
};

export function AndroidWarning({ visible, onClose }: AndroidWarningProps) {
  return (
    <Modal visible={true} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="m-6 w-[90%] rounded-2xl bg-white p-6 shadow-lg">
          <Text className="mb-2 font-poppins_bold text-xl">Aviso importante</Text>
          <Text className="mb-4 font-poppins_regular text-gray-700">
            Arquivos <Text className="font-poppins_bold">.pdf</Text> e{' '}
            <Text className="font-poppins_bold">.docx</Text> podem não ser exibidos corretamente.
            Você poderá abri-los ou baixá-los no navegador.
          </Text>
          <TouchableOpacity onPress={onClose} className="self-end rounded-lg bg-blue-600 px-4 py-2">
            <Text className="font-poppins_bold text-white">Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
