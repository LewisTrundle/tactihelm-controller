import { StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');
const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  fullWidth: '100%',
  fullHeight: '100%'
};

const colors = {
  grey: '#212427',
  white: '#F6F7FC',
  pink: '#E63462',
  green: '#2a9d8f',
  tomato: '#FF6060',
  orange: '#FC7A1E'
};


const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    margin: 20
  },
  connectButtons: {
    justifyContent: "center",
    flexDirection: "row",
  },
  rideButton: {
    bottom: 20
  },
  threatContent: {
    justifyContent: "center",
  },
  distanceText: {
    color: colors.white,
    fontSize: 50,
    textAlign: "center"
  },
  threatText: {
    fontSize: 20
  },
  footerContainer: {
    backgroundColor: colors.white,
    height: 110,
    width: "100%",
    bottom: 30,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.grey,
    alignSelf: "center",
    textAlign: "center",
  }
});


const settingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey
  }
})

const deviceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  devicesContainer: {
    flex: 7,
    justifyContent: "center",
    padding: 25
  },
  deviceIconContainer: {
    alignSelf: "center",
  },
  deviceInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "justify",
  },
  discoveryMessage: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.white,
    alignSelf: "center",
    top: "50%",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 3,
    justifyContent: "center",
  }
});


const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.pink,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    marginHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5
  },
  secondaryButton: {
    backgroundColor: colors.orange,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 18,
    color: colors.white,
  },
  tertiaryButton: {
    backgroundColor: colors.orange,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  tertiaryButtonText: {
    fontSize: 14,
    color: colors.white,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  content: {
    backgroundColor: colors.white,
    padding: 16,
    margin: 16,
    borderRadius: 14,
  },
  titleText: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 20,
  },
  messageText: {
    fontSize: 14,
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  confirmButton: {
    alignSelf: 'center',
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: colors.white,
  },
  center: {
    justifyContent: "center"
  }
});

const debugStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  sendTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendText: {
    flex: 9,
  },
  sendButton: {
    flex: 1
  },
});


const labStudyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
    padding: 5,
  },
  dropdownsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  dropdownContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  dropdownButton: {
    width: 170,
    height: 50,
    backgroundColor: colors.pink,
    borderRadius: 10,
    alignSelf: "center",
  },
  listContainer: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: colors.white,
    alignSelf: "center",
    fontSize: 16,
  },
  smallText: {
    fontSize: 12,
  },
  valueText: {
    color: colors.tomato,
    alignSelf: "center",
    fontSize: 18,
    paddingBottom: 20
  },
  toggleSwitchContainer: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  toggleSwitchLabel: {
    color: colors.white, 
    fontSize: 16,
  },
  distancesContainer: {
    marginTop: 50,
  },

  largeText: {
    fontSize: 24
  },
  blackText: {
    color: "black"
  }
});

export { homeStyles, deviceScreenStyles, buttonStyles, modalStyles, debugStyles, labStudyStyles, settingsScreenStyles }