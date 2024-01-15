import { View } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';

type CustomSelectDropdownProps = {
  data: string[];
  onSelect?: any;
  buttonText?: string;
  defaultValue?: string;
  canSearch?: boolean;
  buttonStyle?: any;
  dropdownStyle?: any;
}

export const CustomSelectDropdown = ({ data, onSelect, buttonText, defaultValue, canSearch, buttonStyle, dropdownStyle }: CustomSelectDropdownProps) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => { onSelect(selectedItem) }}
      defaultButtonText={buttonText}
      // text represented after item is selected
      buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
      // text represented for each item in dropdown
      rowTextForSelection={(item, index) => { return item }}
      defaultValue={defaultValue}
      search={canSearch}
      buttonStyle={buttonStyle}
      dropdownStyle={dropdownStyle}
    />
  )
};