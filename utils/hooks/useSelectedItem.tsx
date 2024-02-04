import { useState } from 'react';
import { Device } from "react-native-ble-plx";
import { BluetoothDevice } from 'react-native-bluetooth-classic';

interface SelectedItemAPI {
  handleItemPress: (item: (Device | BluetoothDevice | string)) => void;
  selectedItem: Device | BluetoothDevice | string | null;
}

export function useSelectedItem(): SelectedItemAPI {
  const [selectedItem, setSelectedItem] = useState<Device | BluetoothDevice | string | null>(null);

  const handleItemPress = (item: (Device | BluetoothDevice | string)): void => {
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return {
    handleItemPress,
    selectedItem,
  }
}