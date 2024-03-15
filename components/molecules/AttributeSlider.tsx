import { View, Text } from 'react-native';
import { CustomSlider } from '../atoms';
import { labStudyStyles } from '../../styles';

type AttributeSliderProps = {
  attribute: any;
  updateAttribute: any
  textColor?: string;
  minTrackColor?: string;
  maxTrackColor?: string;
  renderCondition?: boolean;
  altElement?: any;
}

export const AttributeSlider = ({ attribute, updateAttribute, textColor, minTrackColor, maxTrackColor, altElement, renderCondition=true }: AttributeSliderProps) => {
  const handleSliderChange = (value: number) => {
    updateAttribute(attribute.key, value);
  };

  return (
    <View>
      <Text style={[labStudyStyles.text, { color: textColor }]}>{attribute.name}</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText, { color: textColor }]}>{attribute.description}</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText, { color: textColor }]}>Recommended: {attribute.defaultValue}</Text>
      {renderCondition ? (
        <CustomSlider
          onSlidingComplete={handleSliderChange}
          startingValue={attribute.currentValue}
          minValue={attribute.minValue}
          maxValue={attribute.maxValue}
          stepValue={attribute.step}
          textColor={textColor && textColor}
          minTrackColor={minTrackColor && minTrackColor}
          maxTrackColor={maxTrackColor && maxTrackColor}
        />
      ) : (
        <Text style={[labStudyStyles.valueText]}>{altElement}</Text>
      )}

    </View>
  )
}