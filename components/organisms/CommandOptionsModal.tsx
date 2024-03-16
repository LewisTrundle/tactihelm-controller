import { View, ScrollView } from 'react-native';
import { CustomSelectDropdown } from '../atoms';
import { AlertModal, AttributeSlider } from "../molecules";
import { useVibrationCommand, enumToArray } from "../../utils";
import { debugStyles, labStudyStyles }  from '../../styles';
import { Scheme, Pattern, DistanceUnit, SpeedUnit } from "../../constants";

type CommandOptionsModalProps = {
  title?: string
  visible?: boolean
  onClose?: () => void
  onConfirm?: () => void
};

const distanceUnitList: DistanceUnit[] = ["metres", "miles", "kilometers"];
const speedUnitList: SpeedUnit[] = ["ms", "mph", "kmh"];

export const CommandOptionsModal = ({title, visible, onClose, onConfirm}: CommandOptionsModalProps) => {
  const { pattern, scheme, attributes, updateAttribute, 
    updateCommand, distanceUnits, speedUnits, setDistanceUnits, setSpeedUnits  } = useVibrationCommand();
  let { intensity, stimulusDuration, isi, lowerThreshold, upperThreshold } = attributes;
  const attributeList = [lowerThreshold, upperThreshold, intensity, stimulusDuration, isi ];

  const resetToDefaults = () => {
    updateCommand("WAVE");
    updateCommand("VARYING");
    setDistanceUnits("metres");
    setSpeedUnits("kmh");
    attributeList.forEach((att, index) => {
      updateAttribute(att.key, att.defaultValue);
    });
  };

  return (
    <AlertModal
      title={title}
      visible={visible}
      onClose={() => {
        onClose()
        resetToDefaults()
      }}
      cancelText={"Reset to defaults"}
      onConfirm={onConfirm}
      scrollable={true}
    >
      <View style={debugStyles.container}>

        <View style={labStudyStyles.dropdownsContainer}>
          <CustomSelectDropdown
            data={enumToArray(Pattern)}
            onSelect={updateCommand}
            buttonText="Select an option"
            defaultValue={Pattern[pattern]}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Pattern"}
            titleColor={"black"}
          />
          <CustomSelectDropdown
            data={enumToArray(Scheme)}
            onSelect={updateCommand}
            buttonText="Select an option"
            defaultValue={Scheme[scheme]}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Duration"}
            titleColor={"black"}
          />
        </View>

        <View style={labStudyStyles.dropdownsContainer}>
          <CustomSelectDropdown
            data={distanceUnitList}
            onSelect={setDistanceUnits}
            buttonText="Select an option"
            defaultValue={distanceUnits}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Distance Units"}
            titleColor={"black"}
          />
          <CustomSelectDropdown
            data={speedUnitList}
            onSelect={setSpeedUnits}
            buttonText="Select an option"
            defaultValue={speedUnits}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Speed Units"}
            titleColor={"black"}
          />
        </View>

        {attributeList.map((att, index) => (
          <AttributeSlider
            key={index}
            attribute={att}
            updateAttribute={updateAttribute}
            textColor={'black'}
            minTrackColor={'red'}
            maxTrackColor={'black'}
          />
        ))}
      </View>
    </AlertModal>
  )
};