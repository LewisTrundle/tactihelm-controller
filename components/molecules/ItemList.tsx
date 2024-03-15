import { FlatList, TouchableWithoutFeedback } from "react-native";
import { OpacityButton } from "../atoms";

type ItemListProps = {
  items: any[]
  renderProperty?: string;
  onPress?: any
  style?: string
  canTouch?: boolean;
  horizontal?: boolean;
  selectedItem?: any
  disabled?: boolean
};


export const ItemList = ({items, renderProperty, style, onPress, canTouch=true, horizontal=false, selectedItem=null, disabled=false}: ItemListProps)  => {
  return (
    <FlatList
      data={items}
      nestedScrollEnabled
      horizontal={horizontal}
      renderItem={({item, index, separators}) => (
        <TouchableWithoutFeedback onPress={()=>{}}>
        <OpacityButton 
          text={renderProperty ? item[renderProperty] : item}
          style={style}
          onPress={() => canTouch && onPress(item)}
          disabled={disabled}
          looksDisabled={(selectedItem !== null && selectedItem.toString() !== item)}
        />
        </TouchableWithoutFeedback>
      )}
    />
  );
};