import { View, Text } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';

type CustomSelectDropdownProps = {
  data: (number | string)[];
  onSelect?: any;
  buttonText?: string;
  defaultValue?: string;
  canSearch?: boolean;
  buttonStyle?: any;
  dropdownStyle?: any;
  containerStyle?: any;
  title?: string;
  titleStyle?: any;
}

export const CustomSelectDropdown = ({ data, onSelect, buttonText, defaultValue, canSearch, buttonStyle, dropdownStyle, containerStyle, title, titleStyle }: CustomSelectDropdownProps) => {
  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
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
    </View>
  )
};