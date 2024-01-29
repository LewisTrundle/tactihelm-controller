import { View, Text } from 'react-native';
import { CustomSlider } from '../atoms/CustomSlider';
import { labStudyStyles } from '../../styles';

type AttributeSliderProps = {
  attribute: any;
  updateAttribute: any
  renderCondition?: boolean;
  altElement?: any;
}

export const AttributeSlider = ({ attribute, updateAttribute, renderCondition=true, altElement }: AttributeSliderProps) => {
  const handleSliderChange = (value: number) => {
    updateAttribute(attribute.key, value);
  };

  return (
    <View>
      <Text style={labStudyStyles.text}>{attribute.name}</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>{attribute.description}</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>Recommended: {attribute.defaultValue}</Text>
      {renderCondition ? (
        <CustomSlider
          onSlidingComplete={handleSliderChange}
          startingValue={attribute.currentValue}
          minValue={attribute.minValue}
          maxValue={attribute.maxValue}
          stepValue={attribute.step}
          textColor={"white"}
          maxTrackColor={"red"}
        />
      ) : (
        <Text style={[labStudyStyles.valueText]}>{altElement}</Text>
      )}

    </View>
  )
}