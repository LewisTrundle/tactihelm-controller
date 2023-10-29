import { FlatList, TouchableWithoutFeedback } from "react-native";
import { OpacityButton } from "../atoms/OpacityButton";

type ItemListProps = {
  items: any[]
  onPress?: any
  style?: string
  selectedItem?: any
  disabled?: any
};


export const ItemList = ({items, style, onPress, selectedItem, disabled=false}: ItemListProps)  => {
  return (
    <FlatList
      data={items}
      nestedScrollEnabled
      renderItem={({item, index, separators}) => (
        <TouchableWithoutFeedback onPress={()=>{}}>
        <OpacityButton 
          text={item.name}
          style={style}
          onPress={() => onPress(item)}
          disabled={selectedItem !== null && selectedItem !== item}
        />
        </TouchableWithoutFeedback>
      )}
    />
  );
};