import { View, Text } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import { labStudyStyles }  from '../../styles';

type CustomSelectDropdownProps = {
  data: any[];
  onSelect?: any;
  buttonText?: string;
  defaultValue?: string;
  canSearch?: boolean;
  buttonStyle?: any;
  dropdownStyle?: any;
  containerStyle?: any;
  title?: string;
  titleColor?: any;
}

export const CustomSelectDropdown = ({ data, onSelect, buttonText, defaultValue, canSearch, buttonStyle, dropdownStyle, containerStyle, title, titleColor="white" }: CustomSelectDropdownProps) => {
  return (
    <View style={containerStyle}>
      {title && <Text style={[labStudyStyles.text, { color: titleColor }]}>{title}</Text>}
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